import Image from 'next/image'
import iconImage10 from '@/public/images/icons/10.png'
import iconImage11 from '@/public/images/icons/11.png'
import iconImage12 from '@/public/images/icons/12.png'

export default function Address() {
  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
      <div className='grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-8 my-32'>
        {/* email address card */}
        <div className='bg-white border border-gray-200 rounded-lg shadow-lg p-6'>
          <div className='flex justify-center mb-4 mt-8'>
            <Image
              src={iconImage10}
              alt='email icon'
              width={70}
              height={70}
              className='w-12 h-12'
            />
          </div>
          <h3 className='text-xl font-bold text-center mb-4'>Email Address</h3>
          <p className='text-center text-gray-600 mb-8'>admin@bidco.co.za</p>
        </div>

        {/* Phone Number card */}
        <div className='bg-white border border-gray-200 rounded-lg shadow-lg p-6'>
          <div className='flex justify-center mb-4 mt-8'>
            <Image
              src={iconImage11}
              alt='email icon'
              width={70}
              height={70}
              className='w-12 h-12'
            />
          </div>
          <h3 className='text-xl font-bold text-center mb-4'>
            Contact Numbers
          </h3>
          <p className='text-center text-gray-600 mb-8'>
            <span className='font-bold'>Office:</span> 012 808 9903/4/5
          </p>
        </div>
        {/* Office Address card */}
        <div className='bg-white border border-gray-200 rounded-lg shadow-lg p-6'>
          <div className='flex justify-center mb-4 mt-8'>
            <Image
              src={iconImage12}
              alt='email icon'
              height={70}
              width={70}
              className='w-12 h-12'
            />
          </div>
          <h3 className='text-xl font-bold text-center mb-4'>Our Address</h3>
          <p className='text-center text-gray-600 mb-8'>
            Plot 28, Wolmaranspoort,
            <br />
            Pretoria
          </p>
        </div>
      </div>
    </div>
  )
}
