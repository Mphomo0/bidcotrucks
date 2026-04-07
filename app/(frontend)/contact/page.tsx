import React from 'react'
import PageWrapper from '@/components/ui/layout/PageWrapper'
import Address from '@/components/sections/contact/Address'
import ContactForm from '@/components/sections/forms/ContactForm'
import MapLocation from '@/components/sections/contact/MapLocation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us | Bidco Trucks South Africa',
  description:
    'Contact Bidco Trucks for inquiries about buying, selling, or trading trucks, trailers, and plant equipment. Visit our location or send us a message.',
}

export default function Contact() {
  return (
    <>
      <PageWrapper
        heading='Welcome To Our Company'
        title='Contact Us'
        link={{ href: '/contact', text: 'Contact Us' }}
      ></PageWrapper>
      <Address />
      <ContactForm />
      <MapLocation />
    </>
  )
}
