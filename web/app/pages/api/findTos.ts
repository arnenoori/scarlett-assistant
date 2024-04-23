import { NextApiRequest, NextApiResponse } from 'next';
import { crawlTos } from './crawl';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { url } = req.body;
    console.log('Received POST request with URL:', url);
    try {
      await crawlTos(url);
      res.status(200).json({ message: 'ToS crawled successfully' });
    } catch (error) {
      console.error('Error crawling ToS:', error);
      res.status(500).json({ message: 'Failed to crawl ToS' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}