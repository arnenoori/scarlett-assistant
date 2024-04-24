// api/findTos.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { crawlTos, getWebsiteData } from './crawl';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { url } = req.body;
    console.log('Received POST request with URL:', url);

    try {
      const websiteData = await getWebsiteData(url);
      if (websiteData) {
        await crawlTos(websiteData);
        res.status(200).json({ message: 'ToS crawled successfully' });
      } else {
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