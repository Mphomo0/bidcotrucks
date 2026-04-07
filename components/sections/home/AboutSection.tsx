import Image from 'next/image'
import Link from 'next/link'
import Image1 from '@/public/images/image1.jpg'
import Image2 from '@/public/images/image2.jpg'

export default function AboutSection() {
  return (
    <section className='w-full py-12 sm:py-16 md:py-20 lg:py-24 overflow-hidden bg-white'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center'>
          {/* Left side with overlapping images - improved responsive positioning */}
          <div className='relative h-[400px] sm:h-[500px] md:h-[550px] lg:h-[600px] order-2 lg:order-1'>
            {/* Base image */}
            <div className='absolute left-0 top-0 w-[85%] sm:w-[70%] md:w-[65%] h-full'>
              <Image
                src={Image1}
                alt='DOBBS construction equipment'
                className='rounded-md shadow-lg object-cover'
                fill
                sizes='(max-width: 768px) 75vw, (max-width: 1200px) 40vw, 33vw'
              />
            </div>

            {/* Overlapping image - visible on all screen sizes but positioned differently */}
            <div className='absolute right-0 bottom-0 sm:top-1/4 w-[60%] sm:w-[55%] md:w-[50%] h-[60%] sm:h-[70%] z-10'>
              <Image
                src={Image2}
                alt='CASE excavator equipment'
                className='rounded-md shadow-lg object-cover'
                fill
                sizes='(max-width: 768px) 60vw, (max-width: 1200px) 30vw, 25vw'
              />
            </div>
          </div>

          {/* Right side with text content */}
          <div className='flex flex-col space-y-6 order-1 lg:order-2'>
            <h2 className='text-2xl sm:text-3xl lg:text-3xl font-bold text-gray-900 leading-tight'>
              WE PROVIDE THE BEST QUALITY CONSTRUCTION EQUIPMENT AND EXCELLENT
              SUPPORT SERVICE
            </h2>

            <p className='text-base sm:text-lg text-gray-700'>
              Bidco Trucks (Pty) Ltd, established in 2007, is a trusted name in
              the buying and selling of quality second-hand trucks, trailers,
              and plant equipment. With a strong presence in Pretoria, South
              Africa, we have built a solid reputation for delivering dependable
              vehicles and machinery that meet a wide range of industry needs.
              Our inventory is carefully selected to ensure durability,
              performance, and value for money, making us a preferred partner in
              the transport and construction sectors.
            </p>

            <p className='text-base sm:text-lg text-gray-700'>
              Over the years, Bidco Trucks has expanded its footprint beyond
              South Africa, supplying equipment to countries such as Zambia,
              Zimbabwe, Mozambique, and Ghana. Our dedication to customer
              satisfaction and cross-border service has allowed us to build
              lasting relationships with clients across the continent. Whether
              you&apos;re looking for a single unit or a fleet, Bidco Trucks is
              committed to providing reliable solutions tailored to your
              operational requirements.
            </p>

            <div className='pt-4'>
              <Link
                href='#'
                className='w-full lg:w-[30%] inline-block px-6 sm:px-8 py-3 sm:py-4 bg-[#24603a] text-white font-medium transition-colors duration-200 rounded text-sm sm:text-base text-center'
              >
                VIEW MORE
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
