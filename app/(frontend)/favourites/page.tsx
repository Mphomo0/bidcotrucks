'use client'

import { getWithExpiry } from '@/lib/localStorageWithExpiry'
import { useEffect, useState } from 'react'
import StockCard from '@/components/search/StockCard'
import PageWrapper from '@/components/ui/layout/PageWrapper'
import { Button } from '@/components/ui/button'

const FAVOURITES_KEY = 'favourites'

interface Vehicle {
  id: number
  title: string
  imageUrl: string
  mileage: string
  fuelType: string
  transmission: string
  description: string
  price: number
}

export default function FavouritesPage() {
  const [favourites, setFavourites] = useState([])

  useEffect(() => {
    const favs = getWithExpiry(FAVOURITES_KEY) || []
    setFavourites(favs)
  }, [])

  if (!favourites.length) {
    return (
      <>
        <PageWrapper
          heading='Welcome To Our Company'
          title='Favourites Page'
          link={{ href: '/favourites', text: 'Favourites' }}
        />

        <p className='flex justify-center items-center h-96 h-96 mt-10 text-gray-500'>
          No favourites yet.
        </p>
      </>
    )
  }

  return (
    <>
      <PageWrapper
        heading='Welcome To Our Company'
        title='Favourites Page'
        link={{ href: '/favourites', text: 'Favourites' }}
      />

      <div className='max-w-7xl mx-auto p-6'>
        <div className='flex justify-end'>
          <Button
            className='bg-red-500 text-white mb-16 float-right p-6'
            onClick={() => {
              localStorage.removeItem(FAVOURITES_KEY)
              setFavourites([])
            }}
          >
            Clear All Favourites
          </Button>
        </div>
        <div className='p-6 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
          {favourites.map((vehicle: Vehicle) => (
            <StockCard key={vehicle.id} {...vehicle} />
          ))}
        </div>
      </div>
    </>
  )
}
