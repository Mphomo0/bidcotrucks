import React from 'react'
import PageWrapper from '@/components/ui/layout/PageWrapper'
import Address from '@/components/sections/contact/Address'
import ContactForm from '@/components/sections/contact/ContactForm'
import MapLocation from '@/components/sections/contact/MapLocation'

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
