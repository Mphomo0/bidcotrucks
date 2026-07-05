import { prisma } from '@/lib/prisma'
import StockCard from '@/components/search/StockCard'

// Server component: queries the database directly at render time and is
// cached by the home page's ISR revalidate window (no client fetch, no API
// function invocation). The random pick rotates on each revalidation.
export default async function FeaturedListing() {
  let vehicles: Awaited<ReturnType<typeof prisma.inventory.findMany>> = []

  try {
    const ids = await prisma.inventory.findMany({ select: { id: true } })
    const shuffled = [...ids].sort(() => Math.random() - 0.5)
    const pickedIds = shuffled.slice(0, 6).map((v) => v.id)

    vehicles = await prisma.inventory.findMany({
      where: { id: { in: pickedIds } },
    })
  } catch (error) {
    console.error('Error fetching featured vehicles:', error)
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
          vehicles.map((vehicle) => {
            const images = (vehicle.images as { url: string }[] | null) ?? []
            return (
              <StockCard
                key={vehicle.id}
                title={vehicle.name}
                imageUrl={images[0]?.url || ''}
                mileage={String(vehicle.mileage ?? '')}
                fuelType={vehicle.fuelType ?? ''}
                transmission={vehicle.transmission ?? ''}
                description={vehicle.description}
                price={vehicle.price}
                id={vehicle.id}
              />
            )
          })
        ) : (
          <p className='col-span-full text-center text-gray-500 py-8'>
            No vehicles available
          </p>
        )}
      </div>
    </main>
  )
}
