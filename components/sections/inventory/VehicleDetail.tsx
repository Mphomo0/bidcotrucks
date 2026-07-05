'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ikUrl } from '@/lib/imagekit'
import PageWrapper from '@/components/ui/layout/PageWrapper'
import EnquiryForm from '@/components/sections/forms/EnquiryForm'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { useKeenSlider } from 'keen-slider/react'
import 'keen-slider/keen-slider.min.css'

export interface VehicleDetailData {
  id: string
  name: string
  make: string
  model: string
  year: number
  price: number
  mileage: number | null
  fuelType: string | null
  condition: string
  transmission: string | null
  status: string
  description: string
  images: { url: string }[]
}

export default function VehicleDetail({
  vehicle,
}: {
  vehicle: VehicleDetailData
}) {
  const [currentSlide, setCurrentSlide] = useState(0)

  const [sliderRef, sliderInstanceRef] = useKeenSlider<HTMLDivElement>({
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel)
    },
    slides: {
      perView: 1,
      spacing: 0,
    },
    loop: true,
  })

  const [thumbnailRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    slides: { perView: 5, spacing: 10 },
    slideChanged: (slider) => {
      sliderInstanceRef.current?.moveToIdx(slider.track.details.rel)
    },
  })

  return (
    <>
      <PageWrapper
        heading='Welcome To Our Company'
        title='single vehicle'
        link={{ href: `/inventory/${vehicle.id}`, text: 'Single Vehicle' }}
      />

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 gap-4 lg:grid-cols-[3fr_1fr] mt-12 mb-12'>
          <div className='mb-24'>
            <h1 className='text-3xl font-bold mb-6'>{vehicle.name}</h1>

            <div className='max-w-4xl mx-auto'>
              {vehicle.images.length > 0 && (
                <>
                  {/* Main image slider */}
                  <div className='relative'>
                    <div
                      ref={sliderRef}
                      className='keen-slider aspect-[16/9] w-full mb-4 rounded-lg overflow-hidden shadow-lg border bg-neutral-50'
                    >
                      {vehicle.images.map((img, index) => (
                        <div
                          className='keen-slider__slide relative flex items-center justify-center bg-neutral-100'
                          key={index}
                        >
                          <div className='relative w-full h-full'>
                            <Image
                              src={ikUrl(img.url, 1280)}
                              alt={`${vehicle.name} image ${index + 1}`}
                              fill
                              className='object-cover'
                              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 60vw'
                              priority={index === 0}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Navigation arrows */}
                    {vehicle.images.length > 1 && (
                      <>
                        <button
                          onClick={() => sliderInstanceRef.current?.prev()}
                          className='absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors'
                          aria-label='Previous image'
                        >
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                            className='w-5 h-5'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M15 19l-7-7 7-7'
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => sliderInstanceRef.current?.next()}
                          className='absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors'
                          aria-label='Next image'
                        >
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                            className='w-5 h-5'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M9 5l7 7-7 7'
                            />
                          </svg>
                        </button>
                      </>
                    )}
                  </div>

                  {/* Thumbnail slider */}
                  {vehicle.images.length > 1 && (
                    <div
                      ref={thumbnailRef}
                      className='keen-slider mb-8 cursor-pointer px-2'
                    >
                      {vehicle.images.map((img, index) => (
                        <div
                          key={index}
                          className={`keen-slider__slide transition-all rounded overflow-hidden aspect-video ${
                            currentSlide === index
                              ? 'ring-2 ring-green-600 scale-95'
                              : 'opacity-70 hover:opacity-100'
                          }`}
                          onClick={() =>
                            sliderInstanceRef.current?.moveToIdx(index)
                          }
                        >
                          <div className='relative w-full h-full'>
                            <Image
                              src={ikUrl(img.url, 300)}
                              alt={`Thumbnail ${index + 1}`}
                              fill
                              className='object-cover'
                              sizes='(max-width: 768px) 100px, (max-width: 1024px) 150px, 200px'
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className='font-medium'>Make</TableCell>
                  <TableCell className='text-right'>{vehicle.make}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className='font-medium'>Model</TableCell>
                  <TableCell className='text-right'>{vehicle.model}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className='font-medium'>Year</TableCell>
                  <TableCell className='text-right'>{vehicle.year}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className='font-medium'>Mileage</TableCell>
                  <TableCell className='text-right'>
                    {(vehicle.mileage ?? 0).toLocaleString()} km
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className='font-medium'>Transmission</TableCell>
                  <TableCell className='text-right'>
                    {vehicle.transmission}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className='font-medium'>Fuel Type</TableCell>
                  <TableCell className='text-right'>
                    {vehicle.fuelType}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className='font-medium'>Condition</TableCell>
                  <TableCell className='text-right'>
                    {vehicle.condition}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className='font-medium'>Status</TableCell>
                  <TableCell className='text-right'>{vehicle.status}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className='font-medium'>Description</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{vehicle.description}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div>
            <h1 className='text-right text-3xl font-bold mb-5'>
              R{vehicle.price.toLocaleString()}
            </h1>
            <div className='space-y-6 p-4 border rounded shadow h-[620px] sticky top-10 mb-2'>
              <div className='bg-[#24603a] p-4 rounded'>
                <h2 className='text-xl text-white font-semibold mb-2'>
                  Contact Seller
                </h2>
                <ul className='space-y-1'>
                  <li className='text-2xl text-white semibold'>
                    012 808 9903/4/5
                  </li>
                </ul>
              </div>
              <EnquiryForm vehicleName={vehicle.name} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
