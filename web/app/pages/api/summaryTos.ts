import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import Cors from 'cors';

// Initialize environment variables
config();

// Initialize Supabase client
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

// Initialize CORS middleware
const cors = Cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'HEAD', 'POST', 'OPTIONS'], 
  allowedHeaders: ['*'], 
});

// Helper method to wait for a middleware to execute before continuing
function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: Function) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Run the CORS middleware
  await runMiddleware(req, res, cors);

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
      // Check if the website exists in the database
      const { data: websiteData, error: websiteError } = await supabase
        .from('websites')
        .select('id')
        .eq('normalized_url', url)
        .single();

      if (websiteError) {
        console.error('Error fetching website data from Supabase:', websiteError.message);
        res.status(500).json({ message: 'Internal server error' });
        return;
      }

      if (websiteData) {
        // Website exists in the database, retrieve the simplified_content from terms_of_service table
        const { data: tosData, error: tosError } = await supabase
          .from('terms_of_service')
          .select('simplified_content')
          .eq('website_id', websiteData.id)
          .single();

        if (tosError) {
          console.error('Error fetching terms of service data from Supabase:', tosError.message);
          res.status(500).json({ message: 'Internal server error' });
          return;
        }

        if (tosData) {
          // Return the simplified_content as the response
          res.status(200).json({ summary: tosData.simplified_content });
        } else {
          res.status(404).json({ message: 'Terms of service not found for the website' });
        }
      } else {
        res.status(404).json({ message: 'Website not found in the database' });
      }
    } catch (error) {
      console.error('Error processing request:', error.message);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
