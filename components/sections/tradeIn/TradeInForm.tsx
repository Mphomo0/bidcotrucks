'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'react-toastify'

const tradeInFormSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  cellphone: z.string().min(1, { message: 'Cellphone is required' }),
  altNumber: z.string().min(1, { message: 'Alternative number is required' }),
  town: z.string().min(1, { message: 'Town is required' }),
  make: z.string().min(1, { message: 'Make is required' }),
  model: z.string().min(1, { message: 'Model is required' }),
  year: z.string().min(1, { message: 'Year is required' }),
  mileage: z.string().min(1, { message: 'Mileage is required' }),
  price: z.string().min(1, { message: 'Price range is required' }),
  description: z.string().optional(),
  tradeImages: z
    .any()
    .refine((files) => files?.length > 0, { message: 'Image is required' }),
  comments: z.string().optional(),
})

type TradeInFormData = z.infer<typeof tradeInFormSchema>

export default function TradeInForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TradeInFormData>({
    resolver: zodResolver(tradeInFormSchema),
  })

  // Handle form submission
  const onSubmit = async (data: TradeInFormData) => {
    const formData = new FormData()

    // Append all form fields
    for (const [key, value] of Object.entries(data)) {
      if (key === 'tradeImages') {
        const files = value as FileList
        Array.from(files).forEach((file) => {
          formData.append('tradeImages', file)
        })
      } else {
        formData.append(key, value as string)
      }
    }

    console.log('Form data:', formData)

    try {
      const response = await fetch('/api/send-email/trade-in', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (response.ok) {
        toast.success('Message sent successfully!')
        reset()
      } else {
        toast.error(result.message || 'Something went wrong')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      toast.error('Failed to send message. Please try again later.')
    }
  }

  return (
    <div className='w-full'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-20 mb-20'>
        <form onSubmit={handleSubmit(onSubmit)} encType='multipart/form-data'>
          <h2 className='font-bold text-4xl text-center mb-6'>
            Personal Details
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-6'>
            {/* Name Field */}
            <div>
              <label
                htmlFor='name'
                className='block font-semibold text-lg mb-2'
              >
                Name
              </label>
              <input
                id='name'
                type='text'
                className='w-full p-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='Enter your name'
                {...register('name')}
              />
              {errors.name && (
                <p className='text-red-500 text-sm mt-1'>
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor='email'
                className='block font-semibold text-lg mb-2'
              >
                Email
              </label>
              <input
                id='email'
                type='email'
                className='w-full p-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='Enter your email'
                {...register('email')}
              />
              {errors.email && (
                <p className='text-red-500 text-sm mt-1'>
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6'>
            {/* Cellphone (Main) Field */}
            <div>
              <label
                htmlFor='cellphone'
                className='block font-semibold text-lg mb-2'
              >
                Cellphone (Main)
              </label>
              <input
                id='cellphone'
                type='tel'
                {...register('cellphone')}
                className='w-full p-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='Enter your main cellphone'
              />
              {errors.cellphone && (
                <p className='text-red-500 text-sm mt-1'>
                  {errors.cellphone.message}
                </p>
              )}
            </div>

            {/* Alternative Number Field */}
            <div>
              <label
                htmlFor='alt-number'
                className='block font-semibold text-lg mb-2'
              >
                Alternative Number
              </label>
              <input
                id='alt-number'
                type='tel'
                {...register('altNumber')}
                className='w-full p-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='Enter an alternative number'
              />
              {errors.altNumber && (
                <p className='text-red-500 text-sm mt-1'>
                  {errors.altNumber.message}
                </p>
              )}
            </div>

            {/* Town/Suburb Field */}
            <div>
              <label
                htmlFor='town'
                className='block font-semibold text-lg mb-2'
              >
                Town/Suburb
              </label>
              <input
                id='town'
                type='text'
                {...register('town')}
                className='w-full p-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='Enter your town/suburb'
              />
              {errors.town && (
                <p className='text-red-500 text-sm mt-1'>
                  {errors.town.message}
                </p>
              )}
            </div>
          </div>

          <h2 className='font-bold text-4xl text-center mb-6'>
            Vehicle Details
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-6'>
            {/* Make Field */}
            <div>
              <label
                htmlFor='make'
                className='block font-semibold text-lg mb-2'
              >
                Make
              </label>
              <input
                id='make'
                type='text'
                {...register('make')}
                className='w-full p-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='Enter your make'
              />
              {errors.make && (
                <p className='text-red-500 text-sm mt-1'>
                  {errors.make.message}
                </p>
              )}
            </div>

            {/* model Field */}
            <div>
              <label
                htmlFor='model'
                className='block font-semibold text-lg mb-2'
              >
                Model
              </label>
              <input
                id='model'
                type='text'
                {...register('model')}
                className='w-full p-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='Enter your model'
              />
              {errors.model && (
                <p className='text-red-500 text-sm mt-1'>
                  {errors.model.message}
                </p>
              )}
            </div>

            {/* year Field */}
            <div>
              <label
                htmlFor='year'
                className='block font-semibold text-lg mb-2'
              >
                Year
              </label>
              <input
                id='year'
                type='text'
                {...register('year')}
                className='w-full p-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='Enter Vehicle Year'
              />
              {errors.year && (
                <p className='text-red-500 text-sm mt-1'>
                  {errors.year.message}
                </p>
              )}
            </div>

            {/* Mileage Field */}
            <div>
              <label
                htmlFor='mileage'
                className='block font-semibold text-lg mb-2'
              >
                Mileage
              </label>
              <input
                id='mileage'
                type='text'
                {...register('mileage')}
                className='w-full p-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='Enter Vehicle Mileage '
              />
              {errors.mileage && (
                <p className='text-red-500 text-sm mt-1'>
                  {errors.mileage.message}
                </p>
              )}
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4 mb-6'>
            {/* Price Field */}
            <div>
              <label
                htmlFor='price'
                className='block font-semibold text-lg mb-2'
              >
                Price
              </label>
              <input
                id='price'
                type='text'
                {...register('price')}
                className='w-full p-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='Enter your Price'
              />
              {errors.price && (
                <p className='text-red-500 text-sm mt-1'>
                  {errors.price.message}
                </p>
              )}
            </div>

            {/* Description Field */}
            <div>
              <label
                htmlFor='description'
                className='block font-semibold text-lg mb-2'
              >
                Description
              </label>
              <textarea
                id='description'
                rows={8}
                {...register('description')}
                className='w-full p-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='Vehicle Description.....'
              />
              {errors.description && (
                <p className='text-red-500 text-sm mt-1'>
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Trade in Images Field */}
            <div>
              <label
                htmlFor='tradeImages'
                className='block font-semibold text-lg mb-2'
              >
                Vehicle Images
              </label>
              <input
                id='tradeImages'
                type='file'
                multiple
                {...register('tradeImages')}
                className='w-full p-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='Vehicle Description'
              />
            </div>

            {/* Comments Field */}
            <div>
              <label
                htmlFor='comments'
                className='block font-semibold text-lg mb-2'
              >
                Additional Comments
              </label>
              <textarea
                id='comments'
                rows={4}
                {...register('comments')}
                className='w-full p-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='Additional comments...'
              />
              {errors.comments && (
                <p className='text-red-500 text-sm mt-1'>
                  {errors.comments.message}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className='mb-36'>
            <button
              type='submit'
              className='bg-[#24603a] text-white font-bold py-3 px-6 rounded uppercase w-full md:w-1/6 lg:w-1/6'
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
