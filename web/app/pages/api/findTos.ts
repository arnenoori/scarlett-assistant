// api/findTos.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { crawlTos, getWebsiteData } from './crawl';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    let { url } = req.body;

    // Normalize the URL
    try {
      const parsedUrl = new URL(url);
      url = `${parsedUrl.protocol}//${parsedUrl.hostname}`;
    } catch (error) {
      // If the URL is invalid, try prepending "https://" and parse again
      try {
        const parsedUrl = new URL(`https://${url}`);
        url = `${parsedUrl.protocol}//${parsedUrl.hostname}`;
      } catch (error) {
        // If the URL is still invalid, return an error response
        res.status(400).json({ message: 'Invalid URL provided' });
        return;
      }
    }

    console.log('Received POST request with normalized URL:', url);

    try {
      const websiteData = await getWebsiteData(url);
      if (websiteData) {
        await crawlTos({ ...websiteData, url });
        console.log('Successfully crawled ToS for URL:', url);
        res.status(200).json({ message: 'ToS crawled successfully' });
      } else {
        console.error('Failed to fetch or create website data for URL:', url);
        res.status(500).json({ message: 'Failed to fetch or create website data' });
      }
    } catch (error) {
      console.error('Error crawling ToS:', error);
      res.status(500).json({ message: 'Failed to crawl ToS' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}