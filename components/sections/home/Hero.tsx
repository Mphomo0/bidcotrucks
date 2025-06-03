'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Hero() {
  return (
    <div
      className='bg-cover bg-center w-full min-h-[600px] sm:min-h-[700px] lg:min-h-[800px] overflow-hidden'
      style={{ backgroundImage: 'url("/images/truckscenter.png")' }}
    >
      {/* <div className='absolute bg-black opacity-70 w-full h-full'></div> */}
      <div className='w-full mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-center'>
        <div className='text-center text-white'>
          <div className='space-y-3 sm:space-y-4 md:space-y-6 md:mt-60 lg:mt-72 mt-40'>
            <h1
              className='text-2xl md:text-5xl lg:text-6xl xl:text-7xl font-bold uppercase'
              style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}
            >
              Welcome to Truck Dealer
            </h1>
            <p className='text-lg sm:text-xl md:text-2xl font-semibold'>
              {/* Optional description */}
              BUYERS & SELLERS OF QUALITY SECOND HAND TRUCKS, TRAILERS & PLANT.
            </p>
            <div className='flex justify-center items-center gap-4 mt-6'>
              <Link href={'/inventory'}>
                <Button
                  size='lg'
                  className='bg-[#24603a] hover:bg-red-700 text-white px-6 lg:py-6 text-base sm:px-6 sm:py-4 sm:text-lg md:px-10 md:py-5 md:text-xl'
                >
                  BUY A TRUCK
                </Button>
              </Link>
              <Link href={'/trade-in'}>
                <Button
                  size='lg'
                  className='bg-red-600 hover:bg-[#24603a] text-white px-6 lg:py-6 text-base sm:px-8 sm:py-4 sm:text-lg md:px-10 md:py-5 md:text-xl'
                >
                  SELL A TRUCK
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
