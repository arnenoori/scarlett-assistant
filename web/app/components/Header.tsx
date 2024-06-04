import { Button } from '~/components/Button';
import { Container } from '~/components/Container';
import { Logo } from '~/components/Logo';
import Link from 'next/link';
import GitHubLink from './GitHubLink';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { WebsiteRow } from '~/types/websites';

export function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchResults, setSearchResults] = useState<WebsiteRow[]>([]);
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/websites?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim()) {
      // Perform search request to the server
      const response = await fetch(`/api/search?query=${encodeURIComponent(query.trim())}`);
      const results = await response.json();
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  return (
    <header className="relative z-50 flex-none lg:pt-11">
      <Container className="flex flex-wrap items-center justify-between lg:flex-nowrap">
        <div className="mt-10 lg:mt-0 lg:grow lg:basis-0">
          <Link href="/" legacyBehavior>
            <a>
              <Logo className="w-48 h-auto text-slate-900" />
            </a>
          </Link>
        </div>
        <div className="flex items-center space-x-6">
          <GitHubLink />
          <Link href="/add-a-website" legacyBehavior>
            <a className="text-sm font-semibold leading-6 text-gray-900">
              Add a Website
            </a>
          </Link>
          <Button href="/websites">View all websites</Button>
          <div className="relative">
            <div className="flex items-center">
              <input
                type="search"
                className={`block w-48 rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                  isSearchExpanded ? 'block' : 'hidden'
                }`}
                placeholder="Search"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <button
                type="button"
                className="p-2 text-gray-400 hover:text-gray-500"
                onClick={() => setIsSearchExpanded(!isSearchExpanded)}
              >
                <MagnifyingGlassIcon className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
            {isSearchExpanded && searchResults.length > 0 && (
              <ul className="absolute right-0 w-48 py-2 mt-2 bg-white border border-gray-200 rounded-md shadow-lg top-full">
                {searchResults.map((website) => (
                  <li key={website.id}>
                    <Link href={`/${website.site_name}`} legacyBehavior>
                      <a className="block px-4 py-2 text-sm text-gray-900 hover:bg-gray-100">
                        {website.site_name}
                      </a>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </Container>
    </header>
  );
}