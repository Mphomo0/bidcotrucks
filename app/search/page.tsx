'use client'

import { useSearchParams } from 'next/navigation'
import { useState, Suspense } from 'react'
import PageWrapper from '@/components/ui/layout/PageWrapper'
import StockCard from '@/components/search/StockCard'
import { useEffect } from 'react'

// Vehicle interface remains the same
interface Vehicle {
  id: number
  name: string
  make: string
  model: string
  year: number
  mileage: number
  fuelType: string
  transmission: string
  description: string
  price: number
  images: { url: string }[]
}

async function fetchVehicles(query: string): Promise<Vehicle[]> {
  const res = await fetch(`/api/vehicles?${query}`)

  if (!res.ok) {
    throw new Error(`Error fetching vehicles: ${res.status}`)
  }

  const json = await res.json()
  return json.data || []
}

export default function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams.toString()

  // This is where Suspense will take control over loading state
  const vehicles = fetchVehicles(query) // Throwing a promise here for Suspense

  return (
    <>
      <PageWrapper
        heading='Welcome To Our Company'
        title='Results Page'
        link={{ href: `/search?${searchParams.toString()}`, text: 'Results' }}
      />

      <div className='max-w-7xl mx-auto p-6'>
        <h2 className='text-2xl font-bold mb-4'>Search Results</h2>

        <Suspense
          fallback={
            <div className='flex items-center justify-center h-64'>
              <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#24603a]'></div>
            </div>
          }
        >
          <VehicleList vehiclesPromise={vehicles} />
        </Suspense>
      </div>
    </>
  )
}

function VehicleList({
  vehiclesPromise,
}: {
  vehiclesPromise: Promise<Vehicle[]>
}) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])

  useEffect(() => {
    vehiclesPromise.then(setVehicles).catch((err) => {
      console.error('Failed to fetch vehicles:', err)
      setVehicles([]) // Or you could handle this better
    })
  }, [vehiclesPromise])

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-12'>
      {vehicles.length === 0 ? (
        <div className='col-span-full text-center py-10'>
          <p className='text-lg text-gray-600'>
            No vehicles found matching your criteria.
          </p>
          <button
            onClick={() => window.history.back()}
            className='mt-4 px-4 py-2 bg-[#24603a] text-white rounded hover:bg-[#1a4a2c]'
          >
            Go Back
          </button>
        </div>
      ) : (
        vehicles.map((vehicle) => (
          <StockCard
            key={vehicle.id}
            title={vehicle.name}
            imageUrl={vehicle.images[0]?.url}
            mileage={`${vehicle.mileage}`}
            fuelType={vehicle.fuelType}
            transmission={vehicle.transmission}
            description={vehicle.description}
            price={vehicle.price}
            id={vehicle.id}
          />
        ))
      )}
    </div>
  )
}
