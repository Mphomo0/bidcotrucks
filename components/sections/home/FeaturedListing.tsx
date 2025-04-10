'use client'

import StockCard from '@/components/search/StockCard'

export default function FeaturedListing() {
  return (
    <main className='max-w-7xl mx-auto p-4 md:p-8'>
      <h2 className='text-[#24603a] text-xl font-bold text-center mb-2 mt-12'>
        Our Listings
      </h2>
      <h1 className='text-5xl font-bold text-center mb-4 mt-2'>
        Featured Listings
      </h1>
      <div className='grid grid-cols-1 lg:grid-cols-3 md:grid-cols-3 gap-4 place-items-center my-12'>
        <StockCard
          title='Isuzu F-Series FTR 850 4x4 Isuzu F-Series FTR 850 4x4'
          imageUrl='/images/image1.jpg'
          mileage='3780'
          transmission='Manual'
          fuelType='Diesel'
          description='Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo, nesciunt?'
          price={35199}
          forSale={true}
          onViewMore={() => console.log('View more clicked')}
        />
        <StockCard
          title='HTM 905 Truck'
          imageUrl='/images/image1.jpg'
          mileage='3780'
          transmission='Manual'
          fuelType='Diesel'
          description='Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo, nesciunt?'
          price={35199}
          forSale={true}
          onViewMore={() => console.log('View more clicked')}
        />
        <StockCard
          title='HTM 905 Truck'
          imageUrl='/images/image1.jpg'
          mileage='3780'
          transmission='Automatic'
          fuelType='Diesel'
          description='Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo, nesciunt? Lorem ipsum dolor sit amet consectetur adipisicing elit.'
          price={35199}
          forSale={true}
          onViewMore={() => console.log('View more clicked')}
        />
        <StockCard
          title='Isuzu F-Series FTR 850 4x4 Isuzu F-Series FTR 850 4x4'
          imageUrl='/images/image1.jpg'
          mileage='3780'
          transmission='Manual'
          fuelType='Diesel'
          description='Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo, nesciunt?'
          price={35199}
          forSale={true}
          onViewMore={() => console.log('View more clicked')}
        />
        <StockCard
          title='HTM 905 Truck'
          imageUrl='/images/image1.jpg'
          mileage='3780'
          transmission='Manual'
          fuelType='Diesel'
          description='Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo, nesciunt?'
          price={35199}
          forSale={true}
          onViewMore={() => console.log('View more clicked')}
        />
        <StockCard
          title='HTM 905 Truck'
          imageUrl='/images/image1.jpg'
          mileage='3780'
          transmission='Automatic'
          fuelType='Diesel'
          description='Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo, nesciunt? Lorem ipsum dolor sit amet consectetur adipisicing elit.'
          price={35199}
          forSale={true}
          onViewMore={() => console.log('View more clicked')}
        />
      </div>
    </main>
  )
}
