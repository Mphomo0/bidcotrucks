'use client'

import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ikUrl } from '@/lib/imagekit'

interface StockCardProps {
  id: string
  name: string
  slug?: string
  price: number
  mileage: number
  fuelType: 'PETROL' | 'DIESEL'
  transmission: 'MANUAL' | 'AUTOMATIC'
  status?: 'AVAILABLE' | 'SOLD'
  viewMode: 'grid' | 'list'
  onViewMore: (slug: string) => void
  badge?: {
    text: string
    position?: 'left' | 'right'
  }
  imageUrl: string
}

export default function StockCard({
  id,
  name,
  price,
  mileage,
  fuelType,
  transmission,
  status,
  viewMode,
  badge = { text: '', position: 'left' },
  imageUrl,
}: StockCardProps) {
  return (
    <div
      className={`bg-white rounded-lg overflow-hidden shadow-md border border-gray-200 ${
        viewMode === 'list' ? 'flex flex-col md:flex-row gap-4' : ''
      }`}
    >
      {/* Image Section */}
      <div className={`${viewMode === 'list' ? 'md:w-1/3' : 'w-full'}`}>
        <div className='relative w-full h-64 md:h-full'>
          <Image
            src={ikUrl(imageUrl, 640)}
            alt={name}
            width={500}
            height={300}
            className='w-full h-[200px] object-cover'
          />

          {/* Condition Badge */}
          {badge.text && (
            <div
              className={`absolute top-4 ${
                badge.position === 'right' ? 'right-4' : 'left-4'
              } bg-yellow-500 text-white px-3 py-1 rounded-md text-xs font-semibold`}
            >
              {badge.text}
            </div>
          )}

          {/* Status Badge */}
          {status && (
            <div
              className={`absolute top-2 left-2 px-3 py-1 rounded-md text-xs font-semibold ${
                status === 'AVAILABLE'
                  ? 'bg-green-500 text-white hidden'
                  : 'bg-red-500 text-white'
              }`}
            >
              {status === 'AVAILABLE' ? 'Available' : 'Sold'}
            </div>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div
        className={`p-4 flex flex-col justify-between ${
          viewMode === 'list' ? 'md:w-2/3' : 'w-full'
        }`}
      >
        {/* Top Section with Name */}
        <div className='mb-4'>
          <h3 className='text-xl font-bold text-gray-900 mb-2'>{name}</h3>
          {/* Price moved to bottom in list view */}
          {viewMode !== 'list' && (
            <div>
              <p className='text-xs text-gray-500 font-medium'>Price</p>
              <p className='text-2xl font-bold text-gray-800'>
                R{price.toLocaleString()}
              </p>
            </div>
          )}
        </div>

        {/* Info Grid */}
        <div className='mb-4'>
          <table className='w-full text-sm'>
            <thead>
              <tr className='text-gray-600 font-semibold text-left'>
                <th>Mileage:</th>
                <th>Fuel:</th>
                <th>Transmission:</th>
              </tr>
            </thead>
            <tbody>
              <tr className='text-gray-900'>
                <td>{mileage.toLocaleString()} km</td>
                <td>
                  {' '}
                  {fuelType
                    ? fuelType.charAt(0) + fuelType.slice(1).toLowerCase()
                    : '—'}
                </td>
                <td>
                  {transmission
                    ? transmission.charAt(0) +
                      transmission.slice(1).toLowerCase()
                    : '—'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Bottom Section with Price and Button for List View */}
        {viewMode === 'list' ? (
          <div className='flex justify-between items-center mt-auto'>
            <div>
              <p className='text-xs text-gray-500 font-medium'>Price</p>
              <p className='text-2xl font-bold text-gray-800'>
                R{price.toLocaleString()}
              </p>
            </div>
            {status === 'SOLD' ? (
              <Button
                className='bg-gray-300 text-gray-600 cursor-not-allowed'
                disabled
              >
                SOLD
              </Button>
            ) : (
              <Link href={`/inventory/${id}`} passHref>
                <Button className='bg-[#24603a] hover:bg-black text-white'>
                  VIEW MORE
                </Button>
              </Link>
            )}
          </div>
        ) : (
          /* Action Button for Grid View */
          <div>
            {status === 'SOLD' ? (
              <Button
                className='w-full bg-gray-300 text-gray-600 cursor-not-allowed'
                disabled
              >
                SOLD
              </Button>
            ) : (
              <Link href={`/inventory/${id}`} passHref>
                <Button className='w-full bg-[#24603a] hover:bg-black text-white'>
                  VIEW MORE
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
