import type { NextPage } from 'next'
import PlausibleProvider from 'next-plausible'
import Head from 'next/head'

const Home: NextPage = () => {
  return (
    <PlausibleProvider domain="tosbuddy.com">
      <div className="flex min-h-screen flex-col items-center justify-center py-2">
        <Head>
          <title>TOS Buddy</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
      </div>
    </PlausibleProvider>
  )
}

export default Home