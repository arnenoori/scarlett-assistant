import dynamic from 'next/dynamic';
import { IconChevronLeft, IconExternalLink } from '@supabase/ui';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { Layout } from '~/components/Layout';
import SectionContainer from '~/components/SectionContainer';
import supabase from '~/lib/supabase';
import { WebsiteRow } from '~/types/websites';
import { TermsOfServiceRow } from '~/types/terms_of_service';
import NotFound from '~/pages/not-found';

interface SimplifiedContent {
  summary: {
    [key: string]: string;
  };
  potentialDangers: string[];
  overallAssessment: string;
}

interface Props {
  website: WebsiteRow;
  termsOfService: TermsOfServiceRow | null;
}

function WebsitePage({ website, termsOfService }: Props) {
  if (!website) return <NotFound />;

  let simplifiedContent: SimplifiedContent | null = null;
  try {
    if (termsOfService?.simplified_content) {
      // remove the "json\n" prefix before parsing
      const cleanJson = termsOfService.simplified_content.replace(/^json\n/, '');
      simplifiedContent = JSON.parse(cleanJson) as SimplifiedContent;
    }
  } catch (error) {
    console.error('Failed to parse simplified content:', error);
  }

  return (
    <>
      <Head>
        <title>{website.site_name} | TOS Buddy</title>
        <meta name="description" content={website.website_description || 'Default description'}></meta>
      </Head>

      <Layout>
        <SectionContainer>
          <div className="max-w-5xl col-span-12 mx-auto mb-2 space-y-12 lg:col-span-2">
            <Link href="/websites" className="flex items-center transition-colors cursor-pointer text-scale-1200 hover:text-scale-1000">
              <IconChevronLeft style={{ padding: 0 }} />
              Back
            </Link>

            <div className="flex items-center space-x-4">
              {website.logo_svg && (
                <img src={website.logo_svg} alt={`${website.site_name} logo`} className="w-10 h-10" />
              )}
              <h1 className="h1" style={{ marginBottom: 0 }}>
                {website.site_name}
              </h1>
            </div>

            <div className="grid gap-3 space-y-16 lg:grid-cols-4 lg:space-y-0">
              <div className="lg:col-span-3">
                <h2 className="text-scale-1200" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
                  Overview
                </h2>
                <div className="prose">
                  {simplifiedContent ? (
                    <>
                      <h3>Summary</h3>
                      {simplifiedContent.summary ? (
                        <>
                          {simplifiedContent.summary.DataCollection && (
                            <div className="mb-4">
                              <strong>Data Collection:</strong> <span>{simplifiedContent.summary.DataCollection}</span>
                            </div>
                          )}
                          {simplifiedContent.summary.UserRights && (
                            <div className="mb-4">
                              <strong>User Rights:</strong> <span>{simplifiedContent.summary.UserRights}</span>
                            </div>
                          )}
                          {simplifiedContent.summary.LimitationsOfLiability && (
                            <div className="mb-4">
                              <strong>Limitations Of Liability:</strong> <span>{simplifiedContent.summary.LimitationsOfLiability}</span>
                            </div>
                          )}
                          {simplifiedContent.summary.CancellationAndTermination && (
                            <div className="mb-4">
                              <strong>Cancellation And Termination:</strong> <span>{simplifiedContent.summary.CancellationAndTermination}</span>
                            </div>
                          )}
                        </>
                      ) : (
                        <p>No summary available.</p>
                      )}
                      <h3>Potential Dangers</h3>
                      {simplifiedContent.potentialDangers && simplifiedContent.potentialDangers.length > 0 ? (
                        <ul>
                          {simplifiedContent.potentialDangers.map((danger, index) => (
                            <li key={index} className="mb-2">{danger}</li>
                          ))}
                        </ul>
                      ) : (
                        <p>No potential dangers listed.</p>
                      )}
                      <h3>Overall Assessment</h3>
                      <p>{simplifiedContent.overallAssessment}</p>
                    </>
                  ) : (
                    <p>Loading content...</p>
                  )}
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="p-4 border rounded-lg shadow-md">
                  <h3 className="text-scale-1200" style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Website Stats</h3>
                  {website.website_description && (
                    <p><strong>Description:</strong> {website.website_description}</p>
                  )}
                  {website.category && (
                    <p><strong>Category:</strong> {website.category}</p>
                  )}
                  {termsOfService?.updated_at && (
                    <p><strong>Last Time TOS Updated:</strong> {new Date(termsOfService.updated_at).toLocaleDateString()}</p>
                  )}
                  {termsOfService?.tos_url && (
                    <p><a href={termsOfService.tos_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">View Original TOS</a></p>
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

export async function getStaticPaths() {
  const { data: websites, error } = await supabase
      .from('websites')
      .select('id, site_name');

  if (error) {
      console.error('Failed to fetch slugs:', error.message);
      return { paths: [], fallback: false };
  }

  const paths = websites.map(website => ({
      params: { slug: website.site_name ? website.site_name : `website-${website.id}` },
  }));

  console.log('Generated paths:', paths);  // Detailed logging
  return { paths, fallback: false };
}

// This also gets called at build time
export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    if (!params || !params.slug) {
      console.error('No slug provided in params');
      return { notFound: true };
    }

    console.log('Fetching data for slug:', params.slug);

    const { data: website, error: websiteError } = await supabase
      .from('websites')
      .select('*')
      .eq('site_name', params.slug as string)
      .single();

    if (websiteError || !website) {
      console.error('Error fetching website:', websiteError?.message);
      return { notFound: true };
    }

    console.log('Fetched website:', website);

    // Fetch the latest terms of service based on 'updated_at' or 'version'
    const { data: termsOfService, error: termsOfServiceError } = await supabase
      .from('terms_of_service')
      .select('*')
      .eq('website_id', website.id)
      .order('updated_at', { ascending: false }) // or order by 'version' if applicable
      .limit(1);

    if (termsOfServiceError) {
      console.error('Error fetching terms of service:', termsOfServiceError.message);
    }

    return {
      props: {
        website,
        termsOfService: Array.isArray(termsOfService) && termsOfService.length > 0 ? termsOfService[0] : null,
      },
      revalidate: 18000, // In seconds - refresh every 5 hours
    };
  } catch (err) {
    console.error('Unexpected error in getStaticProps:', err);
    return { notFound: true };
  }
};

export default WebsitePage;