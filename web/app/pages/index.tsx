import { Hero } from '~/components/Hero'
import { Newsletter } from '~/components/Newsletter'
import { Schedule } from '~/components/Schedule'
import { Speakers } from '~/components/Speakers'
import { Sponsors } from '~/components/Sponsors'
import MainLayout from './(main)/layout'  // Import MainLayout

export default function Home() {
  return (
    <MainLayout>  // wrap content with MainLayout
      <>
        <Hero />
        <Speakers />
        <Schedule />
        <Sponsors />
        <Newsletter />
      </>
    </MainLayout>
  )
}