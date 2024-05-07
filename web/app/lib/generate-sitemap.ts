import { WebsiteRow } from '~/types/websites';
import supabase from '~/lib/supabase';

export async function generateSitemap(): Promise<string> {
  const { data: websites } = await supabase
    .from('websites')
    .select('site_name');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>https://tosbuddy.com</loc>
      </url>
      ${websites
        ?.map(
          (website) => `
        <url>
          <loc>https://tosbuddy.com/${website.site_name}</loc>
        </url>
      `
        )
        .join('')}
    </urlset>
  `;

  return sitemap;
}