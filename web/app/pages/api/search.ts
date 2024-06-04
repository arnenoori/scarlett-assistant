import { NextApiRequest, NextApiResponse } from 'next';
import supabase from '~/lib/supabase';
import { WebsiteRow } from '~/types/websites';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { query } = req.query;

    if (typeof query !== 'string') {
      res.status(400).json({ error: 'Invalid search query' });
      return;
    }

    try {
      const { data: websites, error } = await supabase
        .from('websites')
        .select('*')
        .ilike('site_name', `%${query}%`)
        .limit(5);

      if (error) {
        console.error('Error searching websites:', error);
        res.status(500).json({ error: 'An error occurred while searching websites' });
        return;
      }

      res.status(200).json(websites);
    } catch (error) {
      console.error('Error searching websites:', error);
      res.status(500).json({ error: 'An error occurred while searching websites' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}