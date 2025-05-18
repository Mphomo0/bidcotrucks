'use client'

import { useState, useEffect } from 'react'
import { FaEye, FaHeart } from 'react-icons/fa6'
import { GiGearStickPattern } from 'react-icons/gi'
import { BsFillFuelPumpFill } from 'react-icons/bs'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { IoIosSpeedometer } from 'react-icons/io'
import Link from 'next/link' // Import Link component
import { setWithExpiry, getWithExpiry } from '@/lib/localStorageWithExpiry'

interface Favourite {
  id: number
}

interface StockCardProps {
  title: string
  imageUrl: string
  mileage: string
  fuelType: string
  transmission: string
  description: string
  price: number
  id: number // Vehicle ID
}

const FAVOURITES_KEY = 'favourites'

export default function StockCard({ ...props }: StockCardProps) {
  const {
    title,
    imageUrl,
    mileage,
    fuelType,
    transmission,
    description,
    price,
    id,
  } = props

  const [isFavourite, setIsFavourite] = useState(false)

  useEffect(() => {
    const storedFavourites = getWithExpiry(FAVOURITES_KEY) || []
    setIsFavourite(storedFavourites.some((fav: Favourite) => fav.id === id))
  }, [id])

  const handleFavouriteClick = () => {
    const storedFavourites = getWithExpiry(FAVOURITES_KEY) || []

    let updatedFavourites
    if (isFavourite) {
      updatedFavourites = storedFavourites.filter(
        (fav: Favourite) => fav.id !== id
      )
    } else {
      updatedFavourites = [...storedFavourites, props]
    }

    // Save for 30 days
    setWithExpiry(FAVOURITES_KEY, updatedFavourites, 30 * 24 * 60 * 60 * 1000)
    setIsFavourite(!isFavourite)
  }

  return (
    <>
      <Card className='w-full max-w-md overflow-hidden'>
        <CardHeader className='px-6 pb-0'>
          <div className='flex items-center justify-between'>
            <div></div>
            <div className='flex gap-2 mb-2'>
              <Button
                variant='outline'
                size='icon'
                aria-label='favourite'
                className={`hover:bg-green-800 hover:text-white ${
                  isFavourite ? 'text-red-600' : ''
                }`}
                onClick={handleFavouriteClick}
              >
                <FaHeart className='h-5 w-5' />
              </Button>
              <Link href={`/inventory/${id}`}>
                <Button
                  variant='outline'
                  size='icon'
                  aria-label='quick-view'
                  className='hover:bg-green-800 hover:text-white'
                >
                  <FaEye className='h-5 w-5' />
                </Button>
              </Link>
            </div>
          </div>
        </CardHeader>
        <CardContent className='relative p-0'>
          <div className='relative aspect-[4/3] w-full'>
            <Image
              src={imageUrl}
              alt={title}
              fill
              className='px-6'
              sizes='(max-width: 768px) 100vw, 500px'
            />
          </div>

          <div className='gap-x-4 gap-y-8 px-6 py-2'>
            <h2 className='font-bold text-xl truncate w-[90%] overflow-hidden whitespace-nowrap'>
              {title}
            </h2>
          </div>

          <div className='grid grid-cols-3 gap-y-8 px-6 py-2'>
            <div>
              <h3 className='flex items-center gap-2 text-sm font-bold'>
                <span>
                  <IoIosSpeedometer size={15} />
                </span>
                {mileage}
              </h3>
            </div>
            <div>
              <h3 className='flex items-center gap-2 text-sm font-bold'>
                <span>
                  <BsFillFuelPumpFill size={15} />
                </span>
                {fuelType}
              </h3>
            </div>
            <div>
              <h3 className='flex items-center gap-2 text-sm font-bold'>
                <span>
                  <GiGearStickPattern size={15} />
                </span>
                {transmission}
              </h3>
            </div>
            <div className='col-span-3 line-clamp-2'>{description}</div>
          </div>

          <div className='border-t border-border p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm'>TOTAL PRICE</p>
                <p className='text-xl font-bold'>R{price.toLocaleString()}</p>
              </div>
              {/* Use Next.js Link component for navigation */}
              <Link href={`/inventory/${id}`}>
                <Button className='bg-[#24603a] hover:bg-black text-white p-6 px-4'>
                  VIEW MORE
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
