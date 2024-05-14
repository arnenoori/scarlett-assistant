import { IconChevronLeft, IconExternalLink } from '@supabase/ui';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '~/components/Layout';
import SectionContainer from '~/components/SectionContainer';
import supabase from '~/lib/supabase';
import { WebsiteRow } from '~/types/websites';
import { TermsOfServiceRow } from '~/types/terms_of_service';
import Error404 from './404';
import ReactJson from 'react-json-view';

interface Props {
  website: WebsiteRow;
  termsOfService: TermsOfServiceRow | null;
}

function WebsitePage({ website, termsOfService }: Props) {
  if (!website) return <Error404 />;

  return (
    <>
      <Head>
        <title>{website.site_name} | TOS Buddy</title>
        <meta name="description" content={website.website_description}></meta>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <SectionContainer>
          <div className="col-span-12 mx-auto mb-2 max-w-5xl space-y-12 lg:col-span-2">
            {/* Back button */}
            <Link href="/websites">
              <div className="flex cursor-pointer items-center text-scale-1200 transition-colors hover:text-scale-1000">
                <IconChevronLeft style={{ padding: 0 }} />
                Back
              </div>
            </Link>

            <div className="flex items-center space-x-4">
              {website.logo_svg && (
                <img src={website.logo_svg} alt={`${website.site_name} logo`} className="h-10 w-10" />
              )}
              <h1 className="h1" style={{ marginBottom: 0 }}>
                {website.site_name}
              </h1>
            </div>

            <div className="grid gap-3 space-y-16 lg:grid-cols-4 lg:space-y-0">
              <div className="lg:col-span-3">
                <h2
                  className="text-scale-1200"
                  style={{ fontSize: '1.5rem', marginBottom: '1rem' }}
                >
                  Overview
                </h2>

                <div className="prose">
                  <ReactJson src={termsOfService?.simplified_content} />
                </div>
              </div>

              <div>
                <h2
                  className="text-scale-1200"
                  style={{ fontSize: '1.5rem', marginBottom: '1rem' }}
                >
                  Details
                </h2>

                <div className="divide-y text-scale-1200">
                  <div className="flex items-center justify-between py-2">
                    <span className="text-scale-900">Website</span>
                    <a
                      href={website.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-brand-900 transition-colors hover:text-brand-800"
                    >
                      {new URL(website.url).host}
                    </a>
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <span className="text-scale-900">Terms of Service</span>
                    <a
                      href={termsOfService?.tos_url || ''}
                      target="_blank"
                      rel="noreferrer"
                      className="text-brand-900 transition-colors hover:text-brand-800"
                    >
                      <span className="flex items-center space-x-1">
                        <span>View</span>
                        <IconExternalLink size="small" />
                      </span>
                    </a>
                  </div>

                  {website.category && (
                    <div className="flex items-center justify-between py-2">
                      <span className="text-scale-900">Category</span>
                      <span>{website.category}</span>
                    </div>
                  )}

                  {website.last_crawled && (
                    <div className="flex items-center justify-between py-2">
                      <span className="text-scale-900">Last Crawled</span>
                      <span>{new Date(website.last_crawled).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </SectionContainer>
      </Layout>
    </>
  );
}

// This function gets called at build time
export const getStaticPaths: GetStaticPaths = async () => {
  const { data: websites } = await supabase
    .from('websites')
    .select('site_name');

  const paths = websites?.map((website) => ({
    params: { slug: website.site_name },
  })) ?? [];

  return {
    paths,
    fallback: 'blocking',
  };
};

// This also gets called at build time
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { data: website, error: websiteError } = await supabase
    .from('websites')
    .select('*')
    .eq('site_name', params!.slug as string)
    .single();

  if (websiteError || !website) {
    return {
      notFound: true,
    };
  }

  const { data: termsOfService, error: termsOfServiceError } = await supabase
    .from('terms_of_service')
    .select('*')
    .eq('website_id', website.id)
    .single();

  if (termsOfServiceError) {
    console.error('Error fetching terms of service:', termsOfServiceError.message);
  }

  return {
    props: {
      website,
      termsOfService: termsOfService || null,
    },
    revalidate: 18000, // In seconds - refresh every 5 hours
  };
};

export default WebsitePage;