import { useEffect, useState } from 'react';
import { Container } from '~/components/Container';
import supabase from '~/lib/supabase';
import { WebsiteRow } from '~/types/websites';

export function FeaturedSites() {
  const [websites, setWebsites] = useState<WebsiteRow[]>([]);

  useEffect(() => {
    const fetchWebsites = async () => {
      const { data, error } = await supabase
        .from('websites')
        .select('*')
        .order('site_name')
        .limit(3);

      if (error) {
        console.error('Error fetching websites:', error);
      } else {
        setWebsites(data || []);
      }
    };

    fetchWebsites();
  }, []);

  return (
    <section id="FeaturedSites" aria-label="FeaturedSites" className="py-20 sm:py-32">
      <Container>
        <h2 className="max-w-2xl mx-auto text-4xl font-medium tracking-tighter text-center font-display text-blue-1200 sm:text-5xl">
          Recently Added Websites
        </h2>
        <div className="grid max-w-2xl grid-cols-1 pt-10 mx-auto mt-10 border-t border-gray-200 gap-x-8 gap-y-16 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {websites.map((website) => (
            <article key={website.id} className="flex flex-col items-start justify-between max-w-xl">
              <div className="flex items-center text-xs gap-x-4">
                <time dateTime={website.created_at || ''} className="text-gray-1000">
                  {new Date(website.created_at || '').toLocaleDateString()}
                </time>
                <span className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-1000">
                  {website.category || 'Uncategorized'}
                </span>
              </div>
              <div className="relative group">
                <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-1000">
                  <a href={website.url} target="_blank" rel="noopener noreferrer">
                    <span className="absolute inset-0" />
                    {website.site_name}
                  </a>
                </h3>
                <p className="mt-5 text-sm leading-6 text-gray-900 line-clamp-3">
                  {website.website_description || 'No description available.'}
                </p>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}