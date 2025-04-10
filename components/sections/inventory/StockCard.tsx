'use client'

import Image from 'next/image'
import { Button } from '@/components/ui/button'

export type Specification = {
  label: string
  value: string
}

export type Badge = {
  text: string
  color: string
  position?: 'left' | 'right'
}

export type stockCardProps = {
  id: string
  title: string
  description: string
  imageUrl: string
  badge?: Badge
  specifications: Specification[]
  price: {
    label: string
    value: string
  }
  status?: 'available' | 'sold'
  onViewMore?: (id: string) => void
  className?: string
  viewMode?: 'grid' | 'list'
}

export default function StockCard({
  id,
  title,
  description,
  imageUrl,
  badge,
  specifications,
  price,
  status = 'available',
  onViewMore = () => {},
  className,
  viewMode = 'list',
}: stockCardProps) {
  //determine badge position and styling
  const badgePosition = badge?.position || 'left'
  const badgeStyles = {
    left: 'absolute top-0 left-0 text-white px-3 py-1 z-10',
    right:
      'absolute top-0 right-0 text-white px-3 py-1 z-10 rotate-45 origin-bottom-right translate-y-6 -translate-x-6',
  }

  // Map badge color to Tailwind classes
  const badgeColorMap: Record<string, string> = {
    yellow: 'bg-yellow-500',
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    gray: 'bg-gray-500',
    red: 'bg-red-500',
    orange: 'bg-orange-500',
  }

  // Truncate description based on view mode
  const truncatedDescription =
    viewMode === 'grid' && description.length > 100
      ? `${description.substring(0, 100)}...`
      : description
  return (
    <div
      className={`border rounded-md overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow ${className}`}
    >
      <div
        className={`${
          viewMode === 'list' ? 'flex flex-col md:flex-row' : 'flex flex-col'
        }`}
      >
        <div
          className={`relative ${
            viewMode === 'list' ? 'md:w-2/5' : 'w-full'
          } h-64`}
        >
          {badge && (
            <div
              className={`${badgeStyles[badgePosition]} ${
                badgeColorMap[badge.color] || 'bg-blue-500'
              }`}
            >
              {badge.text}
            </div>
          )}
          <Image
            src={imageUrl}
            alt={title}
            width={400}
            height={300}
            className='w-full h-full object-cover'
          />
        </div>
        <div className={`p-6 ${viewMode === 'list' ? 'md:w-3/5' : 'w-full'}`}>
          <h2 className='text-xl font-bold mb-2'>{title}</h2>
          <p className='text-gray-700 mb-4'>{truncatedDescription}</p>

          <div
            className={`grid ${
              viewMode === 'list' ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2'
            } gap-4 mb-4`}
          >
            {specifications.map((spec, index) => (
              <div key={index} className='flex flex-col'>
                <p className='text-sm text-gray-500'>{spec.label}:</p>
                <p className='font-medium'>{spec.value}</p>
              </div>
            ))}
          </div>

          <div className='flex justify-between items-center'>
            <div>
              <p className='text-xs text-gray-500'>{price.label}</p>
              <p
                className={`text-xl font-bold ${
                  status === 'sold' ? 'text-gray-500' : 'text-orange-500'
                }`}
              >
                {price.value}
              </p>
            </div>
            <Button
              onClick={() => onViewMore?.(id)}
              variant={status === 'sold' ? 'outline' : 'default'}
              disabled={status === 'sold'}
            >
              VIEW MORE
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
