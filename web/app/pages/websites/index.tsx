// websites/index.tsx
import { IconLoader, IconSearch, Input } from '@supabase/ui';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState, Fragment } from 'react';
import { useDebounce } from 'use-debounce';
import { Layout } from '~/components/Layout'; // Updated import to use the new Layout
import WebsiteLinkBox from '~/components/WebsiteLinkBox';
import WebsiteTileGrid from '~/components/WebsiteTileGrid';
import SectionContainer from '~/components/SectionContainer';
import supabase from '~/lib/supabase';
import { WebsiteRow } from '~/types/websites';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';

export async function getStaticProps() {
  const { data: websites, error } = await supabase
    .from('websites')
    .select('*')
    .order('site_name');

  if (error) {
    console.error('Error fetching websites:', error);
    return { props: { websites: [] } };
  }

  return {
    props: {
      websites: websites ?? [],
    },
    revalidate: 18000, // In seconds - refresh every 5 hours
  };
}

interface Props {
  websites: WebsiteRow[];
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

function IntegrationWebsitesPage(props: Props) {
  const { websites: initialWebsites } = props;
  const [websites, setWebsites] = useState(initialWebsites);
  const [categories, setCategories] = useState<{ [key: string]: number }>({});
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 40;

  const router = useRouter();

  const meta_title = 'Find a simplified terms of service';
  const meta_description = 'Terms of services simplified for our understanding';

  const [search, setSearch] = useState('');
  const [debouncedSearchTerm] = useDebounce(search, 300);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const searchWebsites = async () => {
      setIsSearching(true);

      let query = supabase
        .from('websites')
        .select('*')
        .order('site_name');

      if (search.trim()) {
        query = query.ilike('site_name', `%${search.trim()}%`);
      }

      if (selectedCategory) {
        query = query.eq('category', selectedCategory);
      }

      const { data: websites } = await query;

      return websites;
    };

    if (search.trim() === '' && !selectedCategory) {
      setIsSearching(false);
      setWebsites(initialWebsites);
      return;
    }

    searchWebsites().then((websites) => {
      if (websites) {
        setWebsites(websites);
      }

      setIsSearching(false);
    });
  }, [debouncedSearchTerm, selectedCategory, router]);

  useEffect(() => {
    const categoryCount: { [key: string]: number } = {};
    initialWebsites.forEach((website) => {
      if (website.category) {
        categoryCount[website.category] = (categoryCount[website.category] || 0) + 1;
      }
    });
    setCategories(categoryCount);
  }, [initialWebsites]);

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const paginatedWebsites = websites.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Layout>
      <Head>
        <title>{meta_title}</title>
        <meta name="description" content={meta_description} />
      </Head>
      <SectionContainer>
        <div className="bg-white px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">Find a simplified terms of service</h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Terms of services simplified for our understanding
            </p>
          </div>
        </div>
        <div className="flex justify-center mb-8">
          <Input
            icon={<IconSearch />}
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mr-4"
          />
          <Menu as="div" className="relative inline-block text-left">
            <div>
              <Menu.Button className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                {selectedCategory || 'Select a category'}
                <ChevronDownIcon className="ml-2 -mr-1 h-5 w-5" aria-hidden="true" />
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => handleCategoryChange(null)}
                        className={classNames(
                          active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                          'block px-4 py-2 text-sm w-full text-left'
                        )}
                      >
                        All Categories
                      </button>
                    )}
                  </Menu.Item>
                  {Object.keys(categories).map((category) => (
                    <Menu.Item key={category}>
                      {({ active }) => (
                        <button
                          onClick={() => handleCategoryChange(category)}
                          className={classNames(
                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                            'block px-4 py-2 text-sm w-full text-left'
                          )}
                        >
                          {category} ({categories[category]})
                        </button>
                      )}
                    </Menu.Item>
                  ))}
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
        <WebsiteTileGrid websites={paginatedWebsites} />
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 mx-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage * itemsPerPage >= websites.length}
            className="px-4 py-2 mx-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </SectionContainer>
    </Layout>
  );
}

export default IntegrationWebsitesPage;