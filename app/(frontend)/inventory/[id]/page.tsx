import { cache } from 'react'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import VehicleDetail, {
  type VehicleDetailData,
} from '@/components/sections/inventory/VehicleDetail'

// ISR: each vehicle page is cached and regenerated at most every 5 minutes
export const revalidate = 300

// cache() dedupes the query between generateMetadata and the page render
const getVehicle = cache(async (id: string): Promise<VehicleDetailData | null> => {
  try {
    const vehicle = await prisma.inventory.findUnique({ where: { id } })
    if (!vehicle) return null

    return {
      id: vehicle.id,
      name: vehicle.name,
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      price: vehicle.price,
      mileage: vehicle.mileage,
      fuelType: vehicle.fuelType,
      condition: vehicle.condition,
      transmission: vehicle.transmission,
      status: vehicle.status,
      description: vehicle.description,
      images: (vehicle.images as { url: string }[] | null) ?? [],
    }
  } catch (error) {
    // Invalid ObjectId strings make Prisma throw; treat them as not found
    console.error('Error fetching vehicle:', error)
    return null
  }
})

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const vehicle = await getVehicle((await params).id)
  if (!vehicle) return { title: 'Vehicle not found | Bidco Trucks' }

  return {
    title: `${vehicle.name} | Bidco Trucks South Africa`,
    description: `${vehicle.year} ${vehicle.make} ${vehicle.model} for sale at R${vehicle.price.toLocaleString()}. ${vehicle.description?.slice(0, 150) ?? ''}`,
    openGraph: {
      title: `${vehicle.name} | Bidco Trucks`,
      images: vehicle.images[0]?.url ? [vehicle.images[0].url] : [],
    },
  }
}

export default async function VehiclePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const vehicle = await getVehicle((await params).id)
  if (!vehicle) notFound()

  return <VehicleDetail vehicle={vehicle} />
}
