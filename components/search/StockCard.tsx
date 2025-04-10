'use client'

import { FaEye, FaArrowRightArrowLeft, FaHeart } from 'react-icons/fa6'
import { GiGearStickPattern } from 'react-icons/gi'
import { BsFillFuelPumpFill } from 'react-icons/bs'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { IoIosSpeedometer } from 'react-icons/io'

interface StockCardProps {
  title: string
  imageUrl: string
  mileage: string
  fuelType: string
  transmission: string
  description: string
  price: number
  forSale?: boolean
  onViewMore?: () => void
}

export default function StockCard({
  title,
  imageUrl,
  mileage,
  fuelType,
  transmission,
  description,
  price,
  forSale = true,
  onViewMore,
}: StockCardProps) {
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
                aria-label='Compare'
                className='hover:bg-green-800 hover:text-white'
              >
                <FaHeart className='h-5 w-5' />
              </Button>
              <Button
                variant='outline'
                size='icon'
                aria-label='Compare'
                className='hover:bg-green-800 hover:text-white'
              >
                <FaEye className='h-5 w-5' />
              </Button>
              <Button
                variant='outline'
                size='icon'
                aria-label='Compare'
                className='hover:bg-green-800 hover:text-white'
              >
                <FaArrowRightArrowLeft className='h-5 w-5' />
              </Button>
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
            {forSale && (
              <div className='absolute right-6 top-2 z-10 bg-[#24603a] px-6 py-2 text-white text-sm font-bold'>
                FOR SALE
              </div>
            )}
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
              <button
                onClick={onViewMore}
                className='bg-[#24603a] hover:bg-black text-white p-3 px-4'
              >
                VIEW MORE
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
