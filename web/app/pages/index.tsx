import { Hero } from '~/components/Hero'
import { Newsletter } from '~/components/Newsletter'
import { FeaturedSites } from '~/components/FeaturedSites'
import MainLayout from './(main)/layout'  // Import MainLayout

export default function Home() {
  return (
    <MainLayout>  // wrap content with MainLayout
      <>
        <Hero />
        <FeaturedSites />
        <Newsletter />
      </>
    </MainLayout>
  )
}