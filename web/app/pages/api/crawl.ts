// api/crawl.ts
// Handles the main crawling functionality, orchestrating the different parts of the API.
import { PlaywrightCrawler, RequestQueue } from 'crawlee';
import fs from 'fs';
import path from 'path';
import { downloadFavicon } from './favicon';
import { processContent } from './summarization';
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { WebsiteRow, WebsiteInsertData } from '~/types/database';

config();

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

async function saveToTextFile(filename: string, content: string, processedContent: string, websiteId: number, tosUrl: string): Promise<void> {
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('terms_of_service')
      .upload(filename, content);
  
    if (uploadError) {
      console.error('Error uploading ToS file to Supabase Storage:', uploadError.message);
      return;
    }
  
    console.log('ToS file uploaded to Supabase Storage:', uploadData);
  
    const { data, error } = await supabase
      .from('terms_of_service')
      .insert([
        {
          website_id: websiteId,
          content: content,
          simplified_content: processedContent,
          tos_url: tosUrl,
          file_path: uploadData.path
        }
      ]);
  
    if (error) {
      console.error('Error inserting ToS data into Supabase:', error.message);
    } else {
      console.log('ToS data inserted into Supabase:', data);
    }
  }

  export async function getWebsiteData(initialUrl: string): Promise<{ websiteId: number; siteName: string; normalizedUrl: string } | null> {
    const normalizedUrl = new URL(initialUrl).origin;
  
    // Check if the normalized URL already exists in the database
    const { data: existingData, error: existingError } = await supabase
      .from('websites')
      .select('*')
      .eq('normalized_url', normalizedUrl);
  
    if (existingError) {
      console.error('Error checking website existence in Supabase:', existingError.message);
      return null;
    }
  
    // If the normalized URL exists, return the first entry
    if (existingData && existingData.length > 0) {
      const firstEntry = existingData[0] as WebsiteRow;
      return { websiteId: firstEntry.id, siteName: firstEntry.site_name, normalizedUrl: firstEntry.normalized_url };
    }
  
    // Website doesn't exist, create a new entry
    console.log('Website not found in database, inserting new entry');
    const siteName = new URL(initialUrl).hostname.replace(/^www\./, '').split('.')[0];
    const insertData = {
      url: initialUrl,
      site_name: siteName,
      normalized_url: normalizedUrl,
      last_crawled: new Date().toISOString(),
    };
    const { data: insertedData, error: insertError } = await supabase
      .from('websites')
      .insert(insertData)
      .single();
  
    if (insertError) {
      console.error('Error inserting website into Supabase:', insertError.message, insertError);
      return null;
    }
  
    if (insertedData) {
      const insertedRow = insertedData as WebsiteRow;
      return { websiteId: insertedRow.id, siteName: insertedRow.site_name, normalizedUrl: insertedRow.normalized_url };
    } else {
      // Check if the website was inserted successfully by querying the database
      const { data: insertedWebsite, error: queryError } = await supabase
        .from('websites')
        .select('*')
        .eq('normalized_url', normalizedUrl)
        .single();
  
      if (queryError) {
        console.error('Error querying inserted website:', queryError.message);
        return null;
      }
  
      if (insertedWebsite) {
        const websiteData = insertedWebsite as { id: number; site_name: string; normalized_url: string }; // Type assertion
        return { websiteId: websiteData.id, siteName: websiteData.site_name, normalizedUrl: websiteData.normalized_url };
      } else {
        console.error('Insert operation did not return expected data. Inserted data:', insertData);
        return null;
      }
    }
  }

  async function updateWebsiteData(websiteId: number, parsedContent: any, initialUrl: string, requestUrl: string, siteName: string, normalizedUrl: string, faviconUrl: string) {
    const { data: websiteData, error: websiteError } = await supabase
      .from('websites')
      .select('*')
      .eq('id', websiteId)
      .single();
  
    if (websiteError) {
      console.error('Error fetching website data from Supabase:', websiteError.message);
      return;
    }
  
    await supabase
      .from('websites')
      .update({
        slug: siteName.toLowerCase().replace(/\s+/g, '-'),
        category: parsedContent.category,
        website: initialUrl,
        normalized_url: normalizedUrl,
        tos_url: requestUrl,
        favicon_url: faviconUrl,
        simplified_overview: parsedContent.summary,
        docs: requestUrl,
        logo: `${siteName.toLowerCase()}_favicon.png`,
      })
      .eq('id', websiteId);
  }

// Normalize URL to its domain root
function normalizeUrlToRoot(inputUrl: string): string {
  // Check if the URL starts with http:// or https://, if not, prepend http://
  if (!inputUrl.startsWith('http://') && !inputUrl.startsWith('https://')) {
    inputUrl = 'https://' + inputUrl;
  }
  const urlObj = new URL(inputUrl);
  return `${urlObj.protocol}//${urlObj.hostname}`;
}

// Function to generate filename based on website name and document title
function generateFilename(urlString: string, pageTitle: string): string {
  const urlObj = new URL(urlString);
  let domainParts = urlObj.hostname.replace(/^(www\.)?/, '').split('.');
  const siteName = domainParts.length > 2 ? domainParts[domainParts.length - 2] : domainParts[0];

  let label = pageTitle.split(' – ')[0].toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/(^_+|_+$)/g, '');

  if (label.includes('terms_of_service') || label.includes('terms')) {
    label = 'tos';
  } else if (label.includes('privacy_policy') || label.includes('privacy')) {
    label = 'privacy_policy';
  }

  return `${siteName}_${label}.txt`;
}

export async function crawlTos(websiteData: { websiteId: number; siteName: string; normalizedUrl: string }) {
  const { websiteId, siteName, normalizedUrl } = websiteData;

  console.log('Starting ToS crawling for URL:', normalizedUrl);
  const requestQueue = await RequestQueue.open();

  console.log('Downloading favicon');
  const faviconUrl = await downloadFavicon(normalizedUrl);

  const crawler = new PlaywrightCrawler({
    requestQueue,

    async requestHandler({ request, page, enqueueLinks }) {
      if (request.userData.isTosPage) {
        console.log('Processing ToS page:', request.url);
        const pageTitle = await page.title();
        const textContent = await page.evaluate(() => document.body.innerText);
        const processedContent = await processContent(textContent);
        const filename = generateFilename(request.url, pageTitle);
        await saveToTextFile(filename, textContent, processedContent, websiteId, request.url);
        console.log(`Saved ToS text content to ${filename}`);

        const parsedContent = JSON.parse(processedContent);
        await updateWebsiteData(websiteId, parsedContent, normalizedUrl, request.url, siteName, normalizedUrl, faviconUrl);
      } else {
        const pageTitle = await page.title();
        console.log(`Title of ${request.url}: ${pageTitle}`);

        const tosLinks = await page.$$eval('a', (anchors: HTMLAnchorElement[]) =>
          anchors
            .filter(a => /terms|tos|privacy/i.test(a.textContent || '') || /terms|tos|privacy/i.test(a.href || ''))
            .map(a => a.href)
            .filter((link): link is string => link !== null)
        );
        for (const link of tosLinks) {
          await requestQueue.addRequest({ url: link, userData: { isTosPage: true } });
        }
      }
    },

    async failedRequestHandler({ request }) {
      console.error(`Request ${request.url} failed too many times.`);
    },
  });

  await requestQueue.addRequest({ url: normalizedUrl, userData: { isTosPage: false } });
  await crawler.run();
}