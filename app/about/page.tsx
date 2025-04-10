import React from 'react'
import PageWrapper from '@/components/ui/layout/PageWrapper'
import AboutSection from '@/components/sections/home/AboutSection'
import Counter from '@/components/sections/home/Counter'
import Testimonials from '@/components/sections/home/Testimonials'

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
