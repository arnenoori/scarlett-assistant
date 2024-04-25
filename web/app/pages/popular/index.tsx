// popular/index.tsx
import { GetStaticProps } from 'next';
import Head from 'next/head';
import WebsiteTileGrid from '~/components/WebsiteTileGrid';
import Layout from '~/components/Layout';
import SectionContainer from '~/components/SectionContainer';
import supabase from '~/lib/supabase';
import { WebsiteRow } from '~/types/websites';

export const getStaticProps: GetStaticProps = async () => {
  const { data: websites, error } = await supabase
    .from('websites')
    .select('*')
    .order('category')
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
};

interface Props {
  websites: WebsiteRow[];
}

function PopularWebsitesPage({ websites }: Props) {
  const meta_title = 'Popular Websites';
  const meta_description = 'Discover the most popular websites and their simplified terms of service.';

  return (
    <>
      <Head>
        <title>{meta_title}</title>
        <meta name="description" content={meta_description} />
      </Head>
      <Layout>
        <SectionContainer>
          <div className="space-y-16">
            <div>
              <h1 className="h1">{meta_title}</h1>
              <h2 className="text-xl text-scale-900">{meta_description}</h2>
            </div>
            <WebsiteTileGrid websites={websites} />
          </div>
        </SectionContainer>
      </Layout>
    </>
  );
}

export default PopularWebsitesPage;