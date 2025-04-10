import AboutSection from '@/components/sections/home/AboutSection'
import Counter from '@/components/sections/home/Counter'
import Hero from '@/components/sections/home/Hero'
import HomeSearch from '@/components/search/HomeSearch'
import Testimonials from '@/components/sections/home/Testimonials'
import FeaturedListing from '@/components/sections/home/FeaturedListing'

export default function Home() {
  return (
    <>
      <Hero />
      <HomeSearch />
      <AboutSection />
      <Counter />
      <FeaturedListing />
      <Testimonials />
    </>
  )
}
