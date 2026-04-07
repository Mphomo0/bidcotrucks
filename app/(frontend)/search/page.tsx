import { Suspense } from 'react'
import SearchResults from '@/components/search/SearchResults'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Search Trucks & Trailers | Find Your Next Vehicle at Bidco Trucks',
  description:
    'Bidco Trucks (Pty) Ltd specializes in buying and selling clean second-hand trucks, trailers, and plant equipment. Serving South Africa and neighboring countries, we offer quality vehicles at competitive prices.',
}

export default function Search() {
  return (
    <Suspense
      fallback={
        <div className='p-8 text-center'>Loading search results...</div>
      }
    >
      <SearchResults />
    </Suspense>
  )
}
