import type { Metadata } from 'next'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Geist, Geist_Mono } from 'next/font/google'
import { SessionProvider } from 'next-auth/react'
import { AppSidebar } from '@/components/sections/dashboard/AppSidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import '../globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Dashboard | Manage Your Account & Listings | Bidco Trucks',
  description:
    'Bidco Trucks (Pty) Ltd specializes in buying and selling clean second-hand trucks, trailers, and plant equipment. Serving South Africa and neighboring countries, we offer quality vehicles at competitive prices.',
}

export default function DashboardLayout({
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
        <SessionProvider>
          <SidebarProvider defaultOpen={true}>
            <AppSidebar />
            <SidebarInset>{children}</SidebarInset>
          </SidebarProvider>
          <ToastContainer />
        </SessionProvider>
      </body>
    </html>
  )
}
