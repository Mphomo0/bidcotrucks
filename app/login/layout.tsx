import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import '../globals.css'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'
import Navbar from '@/components/ui/layout/Navbar'
import FooterSection from '@/components/ui/layout/FooterSection'
import { PostHogProvider } from '../providers'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Login | Bidco Trucks Customer Access',
  description:
    'Bidco Trucks (Pty) Ltd specializes in buying and selling clean second-hand trucks, trailers, and plant equipment. Serving South Africa and neighboring countries, we offer quality vehicles at competitive prices.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <head />
        <PostHogProvider>
          <Navbar />
          {children}
          <ToastContainer />
          <FooterSection />
        </PostHogProvider>
      </body>
    </html>
  )
}
