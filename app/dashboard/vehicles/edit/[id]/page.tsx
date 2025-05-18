'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

interface Vehicle {
  id: string
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
  categoryId: string
  description?: string
}

interface Category {
  id: string
  name: string
}

export default function EditVehiclePage() {
  const router = useRouter()
  const params = useParams()
  const vehicleId = params.id as string

  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<Category[]>([])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Vehicle>()

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const res = await fetch(`/api/vehicles/${vehicleId}`)
        if (!res.ok) throw new Error('Failed to fetch vehicle')
        const data = await res.json()
        reset(data.vehicle)
      } catch (error) {
        console.error(error)
        toast.error('Error fetching vehicle')
      } finally {
        setLoading(false)
      }
    }

    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/category')
        const data = await res.json()
        setCategories(data.categories)
      } catch (error) {
        console.error(error)
      }
    }

    if (vehicleId) {
      fetchVehicle()
      fetchCategories()
    }
  }, [vehicleId, reset])

  const onSubmit = async (formData: Vehicle) => {
    try {
      console.log('Submitting vehicle data:', formData) // 👈 Check what's being sent

      const res = await fetch(`/api/vehicles/${vehicleId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const result = await res.json()
      if (!res.ok) {
        throw new Error(result?.message || 'Failed to update vehicle')
      }

      toast.success('Vehicle updated successfully')
      router.push('/dashboard/vehicles')
    } catch (error) {
      console.error('PUT request error:', error)
      toast.error('Failed to update vehicle')
    }
  }

  if (loading) return <div className='p-4'>Loading...</div>

  return (
    <div className='flex flex-col items-center justify-center min-h-screen p-8'>
      <h1 className='text-2xl font-bold mb-4'>Edit Vehicle</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className='w-full max-w-4xl space-y-6'
      >
        {/* Name */}
        <div className='space-y-2'>
          <label htmlFor='name' className='block text-sm font-medium'>
            Name
          </label>
          <input
            id='name'
            {...register('name', { required: 'Name is required' })}
            className='w-full p-2 border rounded'
          />
          {errors.name && (
            <p className='text-red-500 text-sm'>{errors.name.message}</p>
          )}
        </div>

        {/* Make & Model */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='space-y-2'>
            <label htmlFor='make' className='block text-sm font-medium'>
              Make
            </label>
            <input
              id='make'
              {...register('make', { required: 'Make is required' })}
              className='w-full p-2 border rounded'
            />
            {errors.make && (
              <p className='text-red-500 text-sm'>{errors.make.message}</p>
            )}
          </div>
          <div className='space-y-2'>
            <label htmlFor='model' className='block text-sm font-medium'>
              Model
            </label>
            <input
              id='model'
              {...register('model', { required: 'Model is required' })}
              className='w-full p-2 border rounded'
            />
            {errors.model && (
              <p className='text-red-500 text-sm'>{errors.model.message}</p>
            )}
          </div>
        </div>

        {/* Year & Price */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='space-y-2'>
            <label htmlFor='year' className='block text-sm font-medium'>
              Year
            </label>
            <input
              id='year'
              type='number'
              {...register('year', { required: 'Year is required' })}
              className='w-full p-2 border rounded'
            />
            {errors.year && (
              <p className='text-red-500 text-sm'>{errors.year.message}</p>
            )}
          </div>
          <div className='space-y-2'>
            <label htmlFor='price' className='block text-sm font-medium'>
              Price
            </label>
            <input
              id='price'
              type='number'
              {...register('price', { required: 'Price is required' })}
              className='w-full p-2 border rounded'
            />
            {errors.price && (
              <p className='text-red-500 text-sm'>{errors.price.message}</p>
            )}
          </div>
        </div>

        {/* Fuel Type, Mileage, Condition */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div className='space-y-2'>
            <label htmlFor='fuelType' className='block text-sm font-medium'>
              Fuel Type
            </label>
            <select
              id='fuelType'
              {...register('fuelType')}
              className='w-full p-2 border rounded'
            >
              <option value=''>Select Fuel Type</option>
              <option value='DIESEL'>Diesel</option>
              <option value='PETROL'>Petrol</option>
              <option value='ELECTRIC'>Electric</option>
            </select>
            {errors.fuelType && (
              <p className='text-red-500 text-sm'>{errors.fuelType.message}</p>
            )}
          </div>

          <div className='space-y-2'>
            <label htmlFor='mileage' className='block text-sm font-medium'>
              Mileage
            </label>
            <input
              id='mileage'
              type='number'
              {...register('mileage', { required: 'Mileage is required' })}
              className='w-full p-2 border rounded'
            />
            {errors.mileage && (
              <p className='text-red-500 text-sm'>{errors.mileage.message}</p>
            )}
          </div>

          <div className='space-y-2'>
            <label htmlFor='condition' className='block text-sm font-medium'>
              Condition
            </label>
            <select
              id='condition'
              {...register('condition')}
              className='w-full p-2 border rounded'
            >
              <option value=''>Select Condition</option>
              <option value='USED'>Used</option>
              <option value='NEW'>New</option>
            </select>
            {errors.condition && (
              <p className='text-red-500 text-sm'>{errors.condition.message}</p>
            )}
          </div>
        </div>

        {/* Transmission, Category, Status */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div className='space-y-2'>
            <label htmlFor='transmission' className='block text-sm font-medium'>
              Transmission
            </label>
            <select
              id='transmission'
              {...register('transmission')}
              className='w-full p-2 border rounded'
            >
              <option value=''>Select Transmission</option>
              <option value='MANUAL'>Manual</option>
              <option value='AUTOMATIC'>Automatic</option>
            </select>
            {errors.transmission && (
              <p className='text-red-500 text-sm'>
                {errors.transmission.message}
              </p>
            )}
          </div>

          <div className='space-y-2'>
            <label htmlFor='categoryId' className='block text-sm font-medium'>
              Category
            </label>
            <select
              id='categoryId'
              {...register('categoryId')}
              className='w-full p-2 border rounded'
            >
              <option value=''>Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className='text-red-500 text-sm'>
                {errors.categoryId.message}
              </p>
            )}
          </div>

          <div className='space-y-2'>
            <label htmlFor='status' className='block text-sm font-medium'>
              Status
            </label>
            <select
              id='status'
              {...register('status')}
              className='w-full p-2 border rounded'
            >
              <option value=''>Select Status</option>
              <option value='AVAILABLE'>Available</option>
              <option value='SOLD'>Sold</option>
            </select>
            {errors.status && (
              <p className='text-red-500 text-sm'>{errors.status.message}</p>
            )}
          </div>
        </div>

        {/* Description */}
        <div className='space-y-2'>
          <label htmlFor='description' className='block text-sm font-medium'>
            Description
          </label>
          <textarea
            id='description'
            rows={6}
            {...register('description')}
            className='w-full p-2 border rounded resize-none'
          />
          {errors.description && (
            <p className='text-red-500 text-sm'>{errors.description.message}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type='submit'
          disabled={isSubmitting}
          className='w-full bg-green-600 hover:bg-green-700 text-white p-4 text-md rounded'
        >
          {isSubmitting ? 'Updating...' : 'Update Vehicle'}
        </button>
      </form>
    </div>
  )
}
