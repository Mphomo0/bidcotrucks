import TradeInForm from '@/components/sections/tradeIn/TradeInForm'
import PageWrapper from '@/components/ui/layout/PageWrapper'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Trade-In Your Truck | Bidco Trucks South Africa',
  description:
    'Get a fair deal for your used truck, trailer, or plant equipment. Bidco Trucks offers competitive trade-in values for quality pre-owned vehicles.',
}

export default function TradeIn() {
  return (
    <>
      <PageWrapper
        heading='Welcome To Our Company'
        title='Trade-in Form'
        link={{ href: '/trade-in', text: 'Trade In' }}
      ></PageWrapper>
      <TradeInForm />
    </>
  )
}
