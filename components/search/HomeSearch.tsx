'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useRouter } from 'next/navigation'

const searchFormSchema = z.object({
  category: z.string().min(1, { message: 'Category is required' }),
  make: z.string().min(1, { message: 'Make is required' }),
  model: z.string().min(1, { message: 'Model is required' }),
  year: z.string().min(1, { message: 'Year is required' }),
})

type SearchFormData = z.infer<typeof searchFormSchema>
type Category = { id: string; name: string }

export default function HomeSearch() {
  const [options, setOptions] = useState({
    categories: [] as Category[],
    makes: [] as string[],
    models: [] as string[],
    years: [] as number[],
  })
  const [loading, setLoading] = useState(true)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SearchFormData>({
    resolver: zodResolver(searchFormSchema),
  })

  const router = useRouter()
  const selectedCategory = watch('category')
  const selectedMake = watch('make')
  const selectedModel = watch('model')

  // Initial fetch of all categories
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setLoading(true)
        const res = await fetch('/api/filters')
        if (!res.ok) throw new Error('Failed to fetch filters')
        const data = await res.json()
        setOptions(data)
      } catch (error) {
        console.error('Error fetching options:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchOptions()
  }, [])

  // Update makes when category changes
  useEffect(() => {
    if (selectedCategory) {
      const fetchMakes = async () => {
        try {
          setLoading(true)
          const res = await fetch(`/api/filters?categoryId=${selectedCategory}`)
          if (!res.ok) throw new Error('Failed to fetch makes')
          const data = await res.json()
          setOptions((prev) => ({
            ...prev,
            makes: data.makes,
            models: [],
            years: [],
          }))
          // Reset dependent fields
          setValue('make', '')
          setValue('model', '')
          setValue('year', '')
        } catch (error) {
          console.error('Error fetching makes:', error)
        } finally {
          setLoading(false)
        }
      }
      fetchMakes()
    }
  }, [selectedCategory, setValue])

  // Update models when make changes
  useEffect(() => {
    if (selectedCategory && selectedMake) {
      const fetchModels = async () => {
        try {
          setLoading(true)
          const res = await fetch(
            `/api/filters?categoryId=${selectedCategory}&make=${selectedMake}`
          )
          if (!res.ok) throw new Error('Failed to fetch models')
          const data = await res.json()
          setOptions((prev) => ({ ...prev, models: data.models, years: [] }))
          // Reset dependent field
          setValue('model', '')
          setValue('year', '')
        } catch (error) {
          console.error('Error fetching models:', error)
        } finally {
          setLoading(false)
        }
      }
      fetchModels()
    }
  }, [selectedCategory, selectedMake, setValue])

  // Update years when model changes
  useEffect(() => {
    if (selectedCategory && selectedMake && selectedModel) {
      const fetchYears = async () => {
        try {
          setLoading(true)
          const res = await fetch(
            `/api/filters?categoryId=${selectedCategory}&make=${selectedMake}&model=${selectedModel}`
          )
          if (!res.ok) throw new Error('Failed to fetch years')
          const data = await res.json()
          setOptions((prev) => ({ ...prev, years: data.years }))
          setValue('year', '')
        } catch (error) {
          console.error('Error fetching years:', error)
        } finally {
          setLoading(false)
        }
      }
      fetchYears()
    }
  }, [selectedCategory, selectedMake, selectedModel, setValue])

  const onSubmit = (data: SearchFormData) => {
    const query = new URLSearchParams(data).toString()
    router.push(`/search?${query}`)
  }

  return (
    <div className='max-w-7xl mx-auto py-4'>
      <div className='md:w-[90%] md:mx-auto bg-white md:shadow-lg p-10 md:-mt-36'>
        <h1 className='text-3xl font-bold mb-6'>Find Your Next Truck</h1>
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
                disabled={loading || options.categories.length === 0}
              >
                <option value=''>Select Category</option>
                {options.categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
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
                disabled={
                  loading || !selectedCategory || options.makes.length === 0
                }
              >
                <option value=''>Select Make</option>
                {options.makes.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
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
                disabled={
                  loading || !selectedMake || options.models.length === 0
                }
              >
                <option value=''>Select Model</option>
                {options.models.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
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
                disabled={
                  loading || !selectedModel || options.years.length === 0
                }
              >
                <option value=''>Select Year</option>
                {options.years.map((y) => (
                  <option key={y} value={y.toString()}>
                    {y}
                  </option>
                ))}
              </select>
              {errors.year && (
                <p className='text-red-500 text-sm'>{errors.year.message}</p>
              )}
            </div>

            <div>
              <button
                type='submit'
                className='w-full mt-6 p-4 bg-[#24603a] hover:bg-[#1a4a2c] text-white rounded uppercase font-bold text-md'
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Search'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
