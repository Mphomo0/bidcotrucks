import { Suspense } from 'react'
import SearchResults from '@/components/search/SearchResults'

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
