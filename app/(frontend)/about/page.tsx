import React from 'react'
import PageWrapper from '@/components/ui/layout/PageWrapper'
import AboutSection from '@/components/sections/home/AboutSection'
import Counter from '@/components/sections/home/Counter'
import Testimonials from '@/components/sections/home/Testimonials'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us | Bidco Trucks South Africa',
  description:
    'Learn about Bidco Trucks, a leading provider of quality used trucks, trailers, and plant equipment in South Africa. Serving customers since 2010.',
}

export default function page() {
  return (
    <>
      <PageWrapper
        heading='Welcome To Our Company'
        title='About Us'
        link={{ href: '/about', text: 'About Us' }}
      ></PageWrapper>
      <AboutSection />
      <Counter />
      <Testimonials />
    </>
  )
}
