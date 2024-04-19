import Head from 'next/head'
import AddAWebsite from '~/components/AddAWebsite'
import Layout from '~/components/Layout'
import WebsiteLinkBox from '~/components/WebsiteLinkBox'
import WebsiteTileGrid from '~/components/WebsiteTileGrid'
import SectionContainer from '~/components/SectionContainer'
import supabase from '~/lib/supabase'
import { website as WebsiteType } from '~/types/websites'

export async function getStaticProps() {
  const { data: websites, error } = await supabase
    .from<WebsiteType>('websites') // 'websites' is the table name as a string
    .select('*')
    .eq('approved', true)
    .eq('type', 'popular')
    .order('category')
    .order('title')

  if (error) {
    console.error('Error fetching websites:', error);
    return { props: { websites: [] } }; // Handle the error by returning an empty array or appropriate error handling
  }

  return {
    props: {
      websites,
    },
    revalidate: 18000, // In seconds - refresh every 5 hours
  }
}

interface Props {
  websites: WebsiteType[]
}

function popularwebsitesPage(props: Props) {
  const { websites } = props
  const WebsitesByCategory: { [category: string]: WebsiteType[] } = {}
  websites.map(
    (p) =>
      (WebsitesByCategory[p.category] = [
        ...(WebsitesByCategory[p.category] ?? []),
        p,
      ])
  )

  const meta_title = 'Find an popular'
  const meta_description = `Find an popular to help build your next idea.`

  return (
    <>
      <Head>
        <title>{meta_title} | Supabase website Gallery Example</title>
        <meta name="description" content={meta_description}></meta>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <SectionContainer className="space-y-12">
          <div>
            <h1 className="h1">{meta_title}</h1>
            <h2 className="text-xl text-scale-900">{meta_description}</h2>
          </div>
          <div className="grid grid-cols-12 lg:gap-16 xl:gap-32">
            <div className="col-span-3">
              {/* Horizontal link menu */}
              <div className="space-y-6">
                {/* Search Bar */}
                <div className="space-y-4">
                  <div className="mb-2 text-sm text-scale-900">
                    Explore more
                  </div>
                  <WebsiteLinkBox
                    title="Integrations"
                    color="blue"
                    description="Extend and automate your workflow by using integrations for your favorite tools."
                    href={`/websites/integrations`}
                    icon={
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="1"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"
                        />
                      </svg>
                    }
                  />
                  <WebsiteLinkBox
                    title="Become a website"
                    color="brand"
                    description="Fill out a quick 30 second form to apply to become a website"
                    href={`/websites/integrations#add-a-website`}
                    icon={
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="1"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    }
                  />
                </div>
              </div>
            </div>
            <div className="col-span-9">
              {/* website Tiles */}
              <div className="grid">
                {websites.length ? (
                  <WebsiteTileGrid
                    WebsitesByCategory={WebsitesByCategory}
                    hideCategories={true}
                  />
                ) : (
                  <h2 className="h2">No Companies Found</h2>
                )}
              </div>
            </div>
          </div>

          {/* Become a website form */}
        </SectionContainer>
        <AddAWebsite supabase={supabase} />
      </Layout>
    </>
  )
}

export default popularwebsitesPage
