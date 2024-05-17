import Link from 'next/link';
import { WebsiteRow } from '~/types/websites';

export default function WebsiteTileGrid({
  websites,
}: {
  websites: WebsiteRow[];
}) {
  return (
    <>
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {websites.map((website) => (
          <Link key={website.id} href={`/${website.site_name}`} legacyBehavior>
            <a className="bg-white dark:bg-gray-800 hover:bg-gray-100 hover:dark:bg-gray-700 group flex flex-col w-full h-full p-8 transition-all border border-gray-200 dark:border-gray-700 rounded-lg shadow hover:shadow-lg">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 flex-shrink-0">
                  {website.logo_svg ? (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      dangerouslySetInnerHTML={{ __html: website.logo_svg }}
                      style={{ maxWidth: '100%', maxHeight: '100%' }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full">
                      <span className="text-gray-500 dark:text-gray-400"></span>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-300">
                    {website.site_name}
                  </h3>
                </div>
              </div>
              <p className="text-md text-gray-600 dark:text-gray-400">
                {website.website_description || 'No description available'}
              </p>
            </a>
          </Link>
        ))}
      </div>
    </>
  );
}