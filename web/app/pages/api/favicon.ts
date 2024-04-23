// api/favicon.ts
// Handles favicon retrieval and storage
// make sure that you have set up a storage bucket named favicons in your Supabase project to store the favicon files.
import fs from 'fs';
import path from 'path';
import https from 'https';
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config();

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

// Download favicon and store in Supabase Storage
export async function downloadFavicon(domain: string, callback: (filename: string | null) => void): Promise<void> {
  const faviconUrl = `${domain}/favicon.ico`;
  const filename = `${new URL(domain).hostname}_favicon.ico`;

  https.get(faviconUrl, async (res) => {
    if (res.statusCode === 200) {
      const tempFilePath = path.join(__dirname, filename);
      const fileStream = fs.createWriteStream(tempFilePath);
      res.pipe(fileStream);

      fileStream.on('finish', async () => {
        fileStream.close();
        console.log(`Downloaded favicon to ${tempFilePath}`);

        // Upload the favicon to Supabase Storage
        const { data, error } = await supabase.storage
          .from('favicons')
          .upload(filename, fs.createReadStream(tempFilePath));

        if (error) {
          console.error('Error uploading favicon to Supabase Storage:', error.message);
          callback(null);
        } else {
          console.log('Favicon uploaded to Supabase Storage:', data);
          // Remove the temporary file
          fs.unlinkSync(tempFilePath);
          callback(filename);
        }
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