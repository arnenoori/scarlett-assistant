import { PlaywrightCrawler, RequestQueue } from 'crawlee';
import fs from 'fs';
import path from 'path';
import https from 'https';
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';

config();

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);
const claude = new Anthropic(process.env.ANTHROPIC_API_KEY!);

// Normalize URL to its domain root
function normalizeUrlToRoot(inputUrl: string): string {
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
  let domainParts = urlObj.hostname.replace('www.', '').split('.');
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

async function processContent(content: string) {
  const response = await claude.complete({
    prompt: `
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
      Please ensure the response strictly follows this JSON structure.`,
    model: 'claude-v1',
    max_tokens_to_sample: 500,
  });

  return response.completion;
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { url } = req.body;
    await crawlTos(url);
    res.status(200).json({ message: 'ToS crawled successfully' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

async function crawlTos(initialUrl: string) {
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
  if (websiteData.length === 0) {
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
    websiteId = websiteData[0].website_id;
    await supabase
      .from('websites')
      .update({ last_crawled: new Date().toISOString() })
      .match({ website_id: websiteId });
  }

  downloadFavicon(initialUrl, () => {}); // Download and save favicon

  const crawler = new PlaywrightCrawler({
    requestQueue,

    async requestHandler({ request, page, enqueueLinks }) {
      if (request.userData.isTosPage) {
        const pageTitle = await page.title();
        const textContent = await page.evaluate(() => document.body.innerText);
        const processedContent = await processContent(textContent);
        const filename = generateFilename(request.url, pageTitle);
        await saveToTextFile(filename, textContent, processedContent, websiteId, request.url);
        console.log(`Saved ToS text content to ${filename}`);
      } else {
        const pageTitle = await page.title();
        console.log(`Title of ${request.url}: ${pageTitle}`);

        const tosLinks = await page.$$eval('a', (anchors) =>
          anchors.filter(a => /terms|tos|privacy/i.test(a.textContent) || /terms|tos|privacy/i.test(a.href))
                 .map(a => a.href)
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