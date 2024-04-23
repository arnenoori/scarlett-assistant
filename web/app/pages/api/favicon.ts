// api/favicon.ts
// Handles favicon retrieval and storage
// Make sure that you have set up a storage bucket named "favicons" in your Supabase project to store the favicon files.
import fs from 'fs';
import path from 'path';
import https from 'https';
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import sharp from 'sharp';

config();

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

// Download favicon, convert to PNG, and store in Supabase Storage
export async function downloadFavicon(domain: string): Promise<string | null> {
  const faviconUrl = `${domain}/favicon.ico`;
  const filename = `${new URL(domain).hostname}_favicon.png`; // Change the extension to .png

  return new Promise((resolve) => {
    https.get(faviconUrl, async (res) => {
      if (res.statusCode === 200) {
        const tempFilePath = path.join(__dirname, `${new URL(domain).hostname}_favicon.ico`);
        const fileStream = fs.createWriteStream(tempFilePath);
        res.pipe(fileStream);

        fileStream.on('finish', async () => {
          fileStream.close();
          console.log(`Downloaded favicon to ${tempFilePath}`);

          // Convert ICO to PNG
          const outputFilePath = path.join(__dirname, filename);
          try {
            await sharp(tempFilePath)
              .png()
              .toFile(outputFilePath);
            console.log(`Converted favicon to PNG at ${outputFilePath}`);

            // Upload the PNG favicon to Supabase Storage
            const { data, error } = await supabase.storage
              .from('favicons')
              .upload(filename, fs.createReadStream(outputFilePath));

            if (error) {
              console.error('Error uploading favicon to Supabase Storage:', error.message);
              resolve(null);
            } else {
              console.log('Favicon uploaded to Supabase Storage:', data);
              const { data: publicUrlData } = supabase
                .storage
                .from('favicons')
                .getPublicUrl(filename);

              resolve(publicUrlData.publicUrl);
            }
          } catch (conversionError) {
            console.error('Error converting favicon:', conversionError.message);
            resolve(null);
          } finally {
            // Clean up both the original and converted files
            fs.unlinkSync(tempFilePath);
            fs.unlinkSync(outputFilePath);
          }
        });
      } else {
        console.log(`Failed to download favicon from ${faviconUrl}`);
        resolve(null);
      }
    }).on('error', (err) => {
      console.error(`Error downloading favicon from ${faviconUrl}: ${err.message}`);
      resolve(null);
    });
  });
}