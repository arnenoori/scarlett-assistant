import Head from 'next/head'
import BecomeAwebsite from '~/components/BecomeAWebsite'
import Layout from '~/components/Layout'
import WebsiteLinkBox from '~/components/WebsiteLinkBox'
import WebsiteTileGrid from '~/components/WebsiteTileGrid'
import SectionContainer from '~/components/SectionContainer'
import supabase from '~/lib/supabase'
import { website } from '~/types/websites'

export async function getStaticProps() {
  const { data: websites } = await supabase
    .from<website>('websites')
    .select('*')
    .eq('approved', true)
    .eq('type', 'expert')
    .order('category')
    .order('title')

  return {
    props: {
      websites,
    },
    revalidate: 18000, // In seconds - refresh every 5 hours
  }
}

interface Props {
  websites: website[]
}

function ExpertwebsitesPage(props: Props) {
  const { websites } = props
  const websitesByCategory: { [category: string]: website[] } = {}
  websites.map(
    (p) =>
      (websitesByCategory[p.category] = [
        ...(websitesByCategory[p.category] ?? []),
        p,
      ])
  )

  const meta_title = 'Find an expert'
  const meta_description = `Find an expert to help build your next idea.`

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
                    href={`/websites/integrations#become-a-website`}
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
        <BecomeAwebsite supabase={supabase} />
      </Layout>
    </>
  )
}

export default ExpertwebsitesPage
