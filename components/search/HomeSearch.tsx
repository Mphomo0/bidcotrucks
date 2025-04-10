'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

// Define Zod validation schema
const searchFormSchema = z.object({
  category: z.string().min(1, { message: 'Category is required' }),
  make: z.string().min(1, { message: 'Make is required' }),
  model: z.string().min(1, { message: 'Model is required' }),
  year: z.string().min(1, { message: 'Year is required' }),
})

type SearchFormData = z.infer<typeof searchFormSchema>

export default function HomeSearch() {
  // Use react-hook-form with zodResolver for validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SearchFormData>({
    resolver: zodResolver(searchFormSchema),
  })

  // Handle form submission
  const onSubmit = (data: SearchFormData) => {
    console.log(data)
  }

  return (
    <div className='max-w-7xl mx-auto py-4'>
      <div className='md:w-[90%] md:mx-auto bg-white md:shadow-lg lg:shadow-lg p-10 md:z-10 lg:z-10 -mt-24 md:-mt-36 py-8'>
        <h1 className='text-3xl md:text-4xl lg:text-5xl font-bold mt-2 mb-6'>
          Find Your Next Truck
        </h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8'>
            <div>
              <label htmlFor='category' className='block'>
                Category
              </label>
              <select
                id='category'
                {...register('category')}
                className='w-full p-4 border rounded'
              >
                <option value=''>Select Category</option>
                <option value='toyota'>Trucks</option>
                <option value='honda'>Trailers</option>
                <option value='ford'>Plant</option>
              </select>
              {errors.category && (
                <p className='text-red-500 text-sm'>
                  {errors.category.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor='make' className='block'>
                Make
              </label>
              <select
                id='make'
                {...register('make')}
                className='w-full p-4 border rounded'
              >
                <option value=''>Select Make</option>
                <option value='toyota'>Toyota</option>
                <option value='honda'>Honda</option>
                <option value='ford'>Ford</option>
                <option value='bmw'>BMW</option>
              </select>
              {errors.make && (
                <p className='text-red-500 text-sm'>{errors.make.message}</p>
              )}
            </div>

            <div>
              <label htmlFor='model' className='block'>
                Model
              </label>
              <select
                id='model'
                {...register('model')}
                className='w-full p-4 border rounded'
              >
                <option value=''>Select Model</option>
                <option value='corolla'>Corolla</option>
                <option value='civic'>Civic</option>
                <option value='f150'>F-150</option>
                <option value='x5'>X5</option>
              </select>
              {errors.model && (
                <p className='text-red-500 text-sm'>{errors.model.message}</p>
              )}
            </div>

            <div>
              <label htmlFor='year' className='block'>
                Year
              </label>
              <select
                id='year'
                {...register('year')}
                className='w-full p-4 border rounded'
              >
                <option value=''>Select Year</option>
                <option value='2023'>2023</option>
                <option value='2022'>2022</option>
                <option value='2021'>2021</option>
                <option value='2020'>2020</option>
              </select>
              {errors.year && (
                <p className='text-red-500 text-sm'>{errors.year.message}</p>
              )}
            </div>

            <div>
              <button
                type='submit'
                className='w-full mt-6 p-4 px-4 bg-[#24603a] hover:bg-red-700 text-white rounded uppercase font-bold text-md'
              >
                Search
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
