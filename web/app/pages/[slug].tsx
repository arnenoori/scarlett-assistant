import { IconChevronLeft, IconExternalLink } from '@supabase/ui'
import { marked } from 'marked'
import { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import Layout from '~/components/Layout'
import SectionContainer from '~/components/SectionContainer'
import supabase from '~/lib/supabase'
import { website as WebsiteType } from '~/types/websites'
import Error404 from './404'

function website({ website }: { website: WebsiteType }) {
  if (!website) return <Error404 />

  return (
    <>
      <Head>
        <title>{website.title} | Supabase website Gallery Example</title>
        <meta name="description" content={website.description}></meta>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <SectionContainer>
          <div className="col-span-12 mx-auto mb-2 max-w-5xl space-y-12 lg:col-span-2">
            {/* Back button */}
            <Link
              href={`/websites/${
                website.type === 'technology' ? 'integrations' : 'populars'
              }`}
            >
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
                src={website.logo}
                alt={website.title}
              />
              <h1 className="h1" style={{ marginBottom: 0 }}>
                {website.title}
              </h1>
            </div>

            <div
              className="bg-scale-300 py-6"
              style={{
                marginLeft: 'calc(50% - 50vw)',
                marginRight: 'calc(50% - 50vw)',
              }}
            >
              <Swiper
                initialSlide={0}
                spaceBetween={0}
                slidesPerView={4}
                speed={300}
                // slidesOffsetBefore={300}
                centerInsufficientSlides={true}
                breakpoints={{
                  320: {
                    slidesPerView: 1,
                  },
                  720: {
                    slidesPerView: 2,
                  },
                  920: {
                    slidesPerView: 3,
                  },
                  1024: {
                    slidesPerView: 4,
                  },
                  1208: {
                    slidesPerView: 5,
                  },
                }}
              >
                {website.images.map((image: any, i: number) => {
                  return (
                    <SwiperSlide key={i}>
                      <div className="relative ml-3 mr-3 block cursor-move overflow-hidden rounded-md">
                        <Image
                          layout="responsive"
                          objectFit="contain"
                          width={1460}
                          height={960}
                          src={image}
                          alt={website.title}
                        />
                      </div>
                    </SwiperSlide>
                  )
                })}
              </Swiper>
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
                  dangerouslySetInnerHTML={{ __html: website.overview }}
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
                    <span className="text-scale-900">Developer</span>
                    <span className="text-scale-1200">{website.developer}</span>
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <span className="text-scale-900">Category</span>
                    <Link
                      href={`/websites/${
                        website.type === 'technology'
                          ? 'integrations'
                          : 'populars'
                      }#${website.category.toLowerCase()}`}
                    >
                      <a className="text-brand-900 transition-colors hover:text-brand-800">
                        {website.category}
                      </a>
                    </Link>
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <span className="text-scale-900">Website</span>
                    <a
                      href={website.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-brand-900 transition-colors hover:text-brand-800"
                    >
                      {new URL(website.website).host}
                    </a>
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <span className="text-scale-900">Documentation</span>
                    <a
                      href={website.docs}
                      target="_blank"
                      rel="noreferrer"
                      className="text-brand-900 transition-colors hover:text-brand-800"
                    >
                      <span className="flex items-center space-x-1">
                        <span>Learn</span>
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
  )
}

// This function gets called at build time
export const getStaticPaths: GetStaticPaths = async () => {
  const { data: slugs } = await supabase
    .from('websites')
    .select('slug')

  const paths = slugs?.filter(({ slug }) => slug != null).map(({ slug }) => ({
    params: { slug: slug.toString() }, // Ensure slug is a string and not null
  })) ?? [];

  return {
    paths,
    fallback: 'blocking',
  }
}

// This also gets called at build time
export const getStaticProps: GetStaticProps = async ({ params }) => {
  let { data: website } = await supabase
    .from('websites') // Correctly use the table name as a string
    .select('*')
    .eq('slug', params!.slug as string)
    .single()

  if (!website) {
    return {
      notFound: true,
    }
  }

  // Additional processing if necessary
  return {
    props: { website },
    revalidate: 18000, // In seconds - refresh every 5 hours
  }
}

export default website
