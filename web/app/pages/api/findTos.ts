// api/findTos.ts
// Handles the API request and response, calling the crawlTos function from the api/crawl.ts module.
import { NextApiRequest, NextApiResponse } from 'next';
import { crawlTos } from './crawl';

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