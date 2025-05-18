import type { Metadata } from 'next'

import './globals.css'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'

export const metadata: Metadata = {
  title: 'TruckDealer App',
  description: 'Your Favourite Truck Dealer App',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      {children}
      <ToastContainer />
    </>
  )
}
