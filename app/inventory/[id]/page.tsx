'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import PageWrapper from '@/components/ui/layout/PageWrapper'
import EnquiryForm from '@/components/sections/forms/EnquiryForm'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'

interface Image {
  url: string
}

interface Vehicle {
  id: number
  name: string
  make: string
  model: string
  year: number
  price: number
  mileage: number
  fuelType: string
  condition: string
  transmission: string
  status: string
  description?: string
  slug?: string
  categoryId?: string
  images: Image[]
}

export default function VehiclePage() {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const params = useParams()
  const id = params?.id

  useEffect(() => {
    const fetchVehicle = async () => {
      if (!id) return

      try {
        const res = await fetch(`/api/vehicles/${id}`)

        if (!res.ok) throw new Error('Vehicle not found')

        const json = await res.json()
        setVehicle(json.vehicle) // updated to get the 'vehicle' key from response
      } catch (error) {
        console.error('Error fetching vehicle:', error)
        setError('Failed to load vehicle data')
      } finally {
        setLoading(false)
      }
    }

    fetchVehicle()
  }, [id])

  if (loading)
    return <p className='flex justify-center items-center h-96'>Loading...</p>
  if (error) return <p>{error}</p>
  if (!vehicle)
    return (
      <p className='flex justify-center items-center h-96'>Vehicle not found</p>
    )

  return (
    <>
      <PageWrapper
        heading='Welcome To Our Company'
        title='single vehicle'
        link={{ href: `/inventory/${id}`, text: 'Single Vehicle' }}
      />

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 gap-4 lg:grid-cols-[3fr_1fr] mt-12 mb-12'>
          <div className='mb-24'>
            <h1 className='text-3xl font-bold'>{vehicle.name}</h1>

            {vehicle.images.length > 0 && (
              <div className='my-4'>
                <Image
                  src={vehicle.images[0].url}
                  alt={vehicle.name}
                  width={500}
                  height={500}
                  className='w-full h-auto rounded'
                />
              </div>
            )}

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
                    {vehicle.mileage.toLocaleString()} km
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
                  <TableCell className='text-right'>
                    {vehicle.description ?? 'No description'}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div>
            <h1 className='text-right text-3xl font-bold mb-5'>
              R{vehicle.price.toLocaleString()}
            </h1>
            <div className='space-y-6 p-4 border rounded shadow h-[620px] top-10 mb-2'>
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
