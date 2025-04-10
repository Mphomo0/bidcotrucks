import TradeInForm from '@/components/sections/tradeIn/TradeInForm'
import PageWrapper from '@/components/ui/layout/PageWrapper'

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
