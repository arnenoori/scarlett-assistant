import { IconChevronLeft, IconExternalLink } from '@supabase/ui';
import { marked } from 'marked';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import Layout from '~/components/Layout';
import SectionContainer from '~/components/SectionContainer';
import supabase from '~/lib/supabase';
import { WebsiteRow } from '~/types/websites';
import Error404 from './404';

function WebsitePage({ website }: { website: WebsiteRow }) {
  if (!website) return <Error404 />;

  return (
    <>
      <Head>
        <title>{website.site_name} | Supabase Website Gallery Example</title>
        <meta name="description" content={website.simplified_overview?.summary}></meta>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <SectionContainer>
          <div className="col-span-12 mx-auto mb-2 max-w-5xl space-y-12 lg:col-span-2">
            {/* Back button */}
            <Link href="/websites">
              <a className="flex cursor-pointer items-center text-scale-1200 transition-colors hover:text-scale-1000">
                <IconChevronLeft style={{ padding: 0 }} />
                Back
              </a>
            </Link>

            <div className="flex items-center space-x-4">
              <Image
                layout="fixed"
                width={56}
                height={56}
                className="flex-shrink-f0 h-14 w-14 rounded-full bg-scale-400"
                src={website.favicon_url || '/path/to/default/image.png'}
                alt={website.site_name}
              />
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

                <div
                  className="prose"
                  dangerouslySetInnerHTML={{ __html: marked(website.simplified_overview?.summary || '') }}
                />
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
                    <span className="text-scale-900">Category</span>
                    <Link href={`/websites#${website.category?.toLowerCase()}`}>
                      <a className="text-brand-900 transition-colors hover:text-brand-800">
                        {website.category}
                      </a>
                    </Link>
                  </div>

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
                      href={website.tos_url || ''}
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
  let { data: website } = await supabase
    .from('websites')
    .select('*')
    .eq('site_name', params!.slug as string)
    .single();

  if (!website) {
    return {
      notFound: true,
    };
  }

  return {
    props: { website },
    revalidate: 18000, // In seconds - refresh every 5 hours
  };
};

export default WebsitePage;