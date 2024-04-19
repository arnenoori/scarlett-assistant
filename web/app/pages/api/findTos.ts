import { PlaywrightCrawler, RequestQueue } from 'crawlee';
import fs from 'fs';
import path from 'path';
import https from 'https';
import { createClient } from '@supabase/supabase-js';
import { NextApiRequest, NextApiResponse } from 'next';
import { config } from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';

config();

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

// Normalize URL to its domain root
function normalizeUrlToRoot(inputUrl: string): string {
  // Check if the URL starts with http:// or https://, if not, prepend http://
  if (!inputUrl.startsWith('http://') && !inputUrl.startsWith('https://')) {
    inputUrl = 'https://' + inputUrl;
  }
  const urlObj = new URL(inputUrl);
  return `${urlObj.protocol}//${urlObj.hostname}`;
}

// Download favicon
function downloadFavicon(domain: string, callback: (filename: string | null) => void): void {
  const faviconUrl = `${domain}/favicon.ico`;
  const filename = path.join(__dirname, `${new URL(domain).hostname}_favicon.ico`);

  https.get(faviconUrl, (res) => {
    if (res.statusCode === 200) {
      const fileStream = fs.createWriteStream(filename);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`Downloaded favicon to ${filename}`);
        callback(filename);
      });
    } else {
      console.log(`Failed to download favicon from ${faviconUrl}`);
      callback(null);
    }
  }).on('error', (err) => {
    console.error(`Error downloading favicon from ${faviconUrl}: ${err.message}`);
    callback(null);
  });
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

// Function to save text content to a file
async function saveToTextFile(filename: string, content: string, processedContent: string, websiteId: number, tosUrl: string): Promise<void> {
  fs.writeFileSync(path.join(__dirname, filename), content, { encoding: 'utf8' });

  const { data, error } = await supabase
    .from('terms_of_service')
    .insert([
      {
        website_id: websiteId,
        content: content,
        simplified_content: processedContent,
        tos_url: tosUrl
      }
    ]);

  if (error) {
    console.error('Error inserting ToS data into Supabase:', error.message);
  } else {
    console.log('ToS data inserted into Supabase:', data);
  }
}

// Synchronous message creation and handling
async function processContent(content: string) {
  const response = await anthropic.messages.create({
    model: "claude-3-haiku-20240307",
    max_tokens: 500,
    messages: [
      {
        role: "user",
        content: `
          Analyze the following Terms of Service document and produce a JSON response that simplifies the key sections for a general audience. If certain key sections (such as "Data Collection", "User Rights", "Limitations of Liability", "Cancellation & Termination") exist, summarize them. Additionally, evaluate the document for any potential dangers or unfavorable terms to the user, such as excessive data collection, limited user rights, or other restrictive conditions. Highlight these in a separate section within the JSON.
          
          Input Document:
          ${content}
          
          Expected JSON Output Format:
          {
            "summary": {
              "DataCollection": "Summarize this section in simplified terms.",
              "UserRights": "Summarize this section in simplified terms.",
              "LimitationsOfLiability": "Summarize this section in simplified terms.",
              "CancellationAndTermination": "Summarize this section in simplified terms."
            },
            "potentialDangers": [
              "Highlight any sections that may pose a risk to the user, such as excessive data collection or unfair user restrictions."
            ],
            "overallAssessment": "Indicate whether the terms of service are generally favorable or unfavorable to the user, based on the summaries and identified potential dangers."
          }
          Please ensure the response strictly follows this JSON structure. Wrap the JSON response in triple backticks (\`\`\`) to ensure it is properly formatted.
        `
      }
    ],
  });

  // Accessing the text of the first content block in the response
  const processedText = response.content?.[0]?.text || "Error: Unable to process content.";

  // Extract the JSON from the response by finding the content between triple backticks
  const jsonMatch = processedText.match(/```([\s\S]*)```/);
  if (jsonMatch) {
    return jsonMatch[1].trim();
  } else {
    console.error("Error: Unable to extract JSON from the processed content.");
    return "{}";
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { url } = req.body;
    console.log('Received POST request with URL:', url);
    await crawlTos(url);
    res.status(200).json({ message: 'ToS crawled successfully' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

async function crawlTos(initialUrl: string) {
  console.log('Starting ToS crawling for URL:', initialUrl);
  const requestQueue = await RequestQueue.open();
  initialUrl = normalizeUrlToRoot(initialUrl);

  let siteName = new URL(initialUrl).hostname.replace(/^www\./, '');
  siteName = siteName.split('.')[0];

  let { data: websiteData, error: websiteError } = await supabase
    .from('websites')
    .select('website_id')
    .eq('url', initialUrl);

  if (websiteError) {
    console.error('Error querying website from Supabase:', websiteError.message);
    return;
  }

  let websiteId: number;
  if (!websiteData || websiteData.length === 0) {
    console.log('Website not found in database, inserting new entry');
    const { data: insertData, error: insertError } = await supabase
      .from('websites')
      .insert([{ url: initialUrl, site_name: siteName, last_crawled: new Date().toISOString() }])
      .single();

    if (insertError) {
      console.error('Error inserting website into Supabase:', insertError.message);
      return;
    }

    if (!insertData) {
      console.error('Insert operation did not return expected data.');
      return;
    }

    websiteId = insertData.website_id;
  } else {
    console.log('Website found in database, updating last_crawled timestamp');
    websiteId = websiteData[0].website_id;
    await supabase
      .from('websites')
      .update({ last_crawled: new Date().toISOString() })
      .match({ website_id: websiteId });
  }

  console.log('Downloading favicon');
  downloadFavicon(initialUrl, () => {});

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

        // Update the website entry in Supabase with the processed data
        const { data: websiteData, error: websiteError } = await supabase
          .from('websites')
          .select('*')
          .eq('website_id', websiteId)
          .single();

        if (websiteError) {
          console.error('Error fetching website data from Supabase:', websiteError.message);
          return;
        }

        const parsedContent = JSON.parse(processedContent);

        await supabase
          .from('websites')
          .update({
            slug: websiteData.site_name.toLowerCase().replace(/\s+/g, '-'),
            category: parsedContent.category,
            website: initialUrl,
            docs: request.url,
            overview: parsedContent.summary,
            logo: `${websiteData.site_name.toLowerCase()}_favicon.ico`,
            approved: true,
          })
          .eq('website_id', websiteId);
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