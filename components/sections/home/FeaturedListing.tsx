'use client'

import { useEffect, useState } from 'react'
import StockCard from '@/components/search/StockCard'

interface Vehicle {
  id: number
  name: string
  images: Array<{ url: string }>
  mileage: string
  fuelType: string
  transmission: string
  description: string
  price: number
}

export default function FeaturedListing() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch vehicles data from the API on component mount
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch('/api/featured/')
        
        if (!response.ok) {
          console.error('API error:', response.status, await response.text())
          return
        }
        
        const data = await response.json()
        
        if (Array.isArray(data)) {
          setVehicles(data)
        } else if (data.error) {
          console.error('API error:', data.error)
        }
      } catch (error) {
        console.error('Error fetching vehicles:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchVehicles()
  }, [])

  if (loading) {
    return <p className='flex justify-center items-center h-96'>Loading...</p>
  }

  return (
    <main className='max-w-7xl mx-auto p-4 md:p-8'>
      <h2 className='text-[#24603a] text-xl font-bold text-center mb-2 mt-12'>
        Our Listings
      </h2>
      <h1 className='text-5xl font-bold text-center mb-4 mt-2'>
        Featured Listings
      </h1>
      <div className='grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-4 place-items-center my-12'>
        {vehicles.length > 0 ? (
          vehicles.map((vehicle) => (
            <StockCard
              key={vehicle.id}
              title={vehicle.name}
              imageUrl={vehicle.images?.[0]?.url || ''}
              mileage={vehicle.mileage}
              fuelType={vehicle.fuelType}
              transmission={vehicle.transmission}
              description={vehicle.description}
              price={vehicle.price}
              id={vehicle.id}
            />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500 py-8">
            No vehicles available
          </p>
        )}
      </div>
    </main>
  )
}
