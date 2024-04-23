// api/crawl.ts
// Handles the main crawling functionality, orchestrating the different parts of the API.
import { PlaywrightCrawler, RequestQueue } from 'crawlee';
import fs from 'fs';
import path from 'path';
import { downloadFavicon } from './favicon';
import { processContent } from './summarization';
import { createClient } from '@supabase/supabase-js';
import { WebsiteData } from '~/types/websites';
import { config } from 'dotenv';
import { PostgrestSingleResponse } from '@supabase/supabase-js';

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

async function getWebsiteData(initialUrl: string): Promise<{ websiteId: number; siteName: string } | null> {
    const normalizedUrl = new URL(initialUrl).origin;
    let { data: websiteData, error: websiteError }: PostgrestSingleResponse<WebsiteData> = await supabase
      .from('websites')
      .select('id, site_name')
      .eq('url', normalizedUrl)
      .single();
  
    if (websiteError) {
      console.error('Error querying website from Supabase:', websiteError.message);
      return null;
    }
  
    if (websiteData) {
      return { websiteId: websiteData.id, siteName: websiteData.site_name };
    } else {
      console.log('Website not found in database, inserting new entry');
      const siteName = new URL(initialUrl).hostname.replace(/^www\./, '').split('.')[0];
      const { data: insertData, error: insertError }: PostgrestSingleResponse<WebsiteData> = await supabase
        .from('websites')
        .insert({
          url: normalizedUrl,
          site_name: siteName,
          last_crawled: new Date().toISOString()
        })
        .single();
  
      if (insertError) {
        console.error('Error inserting website into Supabase:', insertError.message);
        return null;
      }
  
      if (insertData) {
        return { websiteId: insertData.id, siteName: insertData.site_name };
      } else {
        console.error('Insert operation did not return expected data.');
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

export async function crawlTos(initialUrl: string) {
    console.log('Starting ToS crawling for URL:', initialUrl);
    const requestQueue = await RequestQueue.open();
    const normalizedUrl = normalizeUrlToRoot(initialUrl);
  
    const websiteData = await getWebsiteData(normalizedUrl);
    if (!websiteData) {
      console.error('Unable to fetch or create website data.');
      return;
    }
  
    const { websiteId, siteName } = websiteData;
  
    console.log('Downloading favicon');
    const faviconUrl = await downloadFavicon(initialUrl);
  
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
          await updateWebsiteData(websiteId, parsedContent, initialUrl, request.url, siteName, normalizedUrl, faviconUrl);
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
  
    await requestQueue.addRequest({ url: initialUrl, userData: { isTosPage: false } });
    await crawler.run();
  }