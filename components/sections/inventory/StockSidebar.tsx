'use client'

import { useEffect, useMemo, useState, useRef } from 'react'
import { Slider } from '@/components/ui/slider'

export type Category = {
  id: string
  name: string
}

export type FilterOptions = {
  category: Category[]
  make: string[]
  model: string[]
  year: number[]
}

export type FilterValues = {
  category: string
  make: string
  model: string
  year: string
  priceRange: [number, number]
}

export type StockSidebarProps = {
  filterOptions: FilterOptions
  filters: FilterValues
  onFilterChange: (
    key: keyof FilterValues,
    value: FilterValues[keyof FilterValues]
  ) => void
  priceRange: { min: number; max: number }
}

export default function StockSidebar({
  filterOptions,
  filters,
  onFilterChange,
  priceRange,
}: StockSidebarProps) {
  const [loading, setLoading] = useState(false)
  const isInitialMount = useRef(true)
  const prevFiltersRef = useRef({ category: '', make: '', model: '' })

  // Store dynamic filter options received from API
  const [dynamicFilterOptions, setDynamicFilterOptions] = useState<{
    makes: string[]
    models: string[]
    years: number[]
  }>({
    makes: [],
    models: [],
    years: [],
  })

  // Normalize price values for slider (0-100)
  const sliderValue = useMemo(() => {
    const priceDiff = priceRange.max - priceRange.min || 1
    return [
      ((filters.priceRange[0] - priceRange.min) / priceDiff) * 100,
      ((filters.priceRange[1] - priceRange.min) / priceDiff) * 100,
    ] as [number, number]
  }, [filters.priceRange, priceRange])

  // Fetch updated filter options
  useEffect(() => {
    // Skip initial render
    if (isInitialMount.current) {
      isInitialMount.current = false
      prevFiltersRef.current = {
        category: filters.category,
        make: filters.make,
        model: filters.model,
      }
      return
    }

    // Skip if no filter has changed
    if (
      prevFiltersRef.current.category === filters.category &&
      prevFiltersRef.current.make === filters.make &&
      prevFiltersRef.current.model === filters.model
    ) {
      return
    }

    // Update previous filters
    prevFiltersRef.current = {
      category: filters.category,
      make: filters.make,
      model: filters.model,
    }

    const fetchFilterOptions = async () => {
      try {
        setLoading(true)
        const query = new URLSearchParams()

        if (filters.category && filters.category !== 'all')
          query.set('category', filters.category)
        if (filters.make && filters.make !== 'all')
          query.set('make', filters.make)
        if (filters.model && filters.model !== 'all')
          query.set('model', filters.model)

        // Set page to 1 and limit to 1 to minimize data transfer
        // We only need the filter options, not the actual inventory data
        query.set('page', '1')
        query.set('limit', '1')

        const res = await fetch(`/api/vehicles/inventory?${query.toString()}`)
        if (!res.ok) throw new Error('Failed to fetch filter options')

        const data = await res.json()

        // Update dynamic filter options with data from API
        if (data.filters) {
          setDynamicFilterOptions({
            makes: data.filters.makes || [],
            models: data.filters.models || [],
            years: data.filters.years || [],
          })
        }

        // Update price range if available
        if (
          data.priceRange &&
          typeof data.priceRange.min === 'number' &&
          typeof data.priceRange.max === 'number'
        ) {
          const newMin = data.priceRange.min
          const newMax = data.priceRange.max

          // Only update if different to avoid loops
          if (
            newMin !== filters.priceRange[0] ||
            newMax !== filters.priceRange[1]
          ) {
            onFilterChange('priceRange', [newMin, newMax])
          }
        } else {
          console.warn('priceRange is missing or invalid in response:', data)
        }
      } catch (error) {
        console.error('Error fetching filter options:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFilterOptions()
  }, [filters.category, filters.make, filters.model, onFilterChange])

  const handleSliderChange = (value: number[]) => {
    const priceDiff = priceRange.max - priceRange.min || 1
    const calculatedPrice: [number, number] = [
      Math.round(priceRange.min + (value[0] / 100) * priceDiff),
      Math.round(priceRange.min + (value[1] / 100) * priceDiff),
    ]
    onFilterChange('priceRange', calculatedPrice)
  }

  // Reset dependent fields when parent filter changes
  useEffect(() => {
    if (!isInitialMount.current) {
      // When category changes, reset make, model, and year
      if (prevFiltersRef.current.category !== filters.category) {
        onFilterChange('make', 'all')
        onFilterChange('model', 'all')
        onFilterChange('year', 'all')
      }

      // When make changes, reset model and year
      else if (prevFiltersRef.current.make !== filters.make) {
        onFilterChange('model', 'all')
        onFilterChange('year', 'all')
      }

      // When model changes, reset year
      else if (prevFiltersRef.current.model !== filters.model) {
        onFilterChange('year', 'all')
      }
    }
  }, [filters.category, filters.make, filters.model, onFilterChange])

  return (
    <form className='space-y-6'>
      {/* Category */}
      <div className='bg-gray-100 p-4 rounded-md'>
        <h3 className='font-bold mb-4'>Category</h3>
        <select
          name='category'
          className='w-full p-2 rounded-md'
          value={filters.category}
          onChange={(e) => onFilterChange('category', e.target.value)}
          disabled={loading}
        >
          <option value='all'>All Categories</option>
          {filterOptions.category.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Manufacturer */}
      <div className='bg-gray-100 p-4 rounded-md'>
        <h3 className='font-bold mb-4'>Manufacturer</h3>
        <select
          name='make'
          className='w-full p-2 rounded-md'
          value={filters.make}
          onChange={(e) => onFilterChange('make', e.target.value)}
          disabled={loading}
        >
          <option value='all'>All Manufacturers</option>
          {/* Use dynamic makes from API when available, otherwise use static options */}
          {(dynamicFilterOptions.makes.length > 0
            ? dynamicFilterOptions.makes
            : filterOptions.make
          ).map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>
      </div>

      {/* Model */}
      <div className='bg-gray-100 p-4 rounded-md'>
        <h3 className='font-bold mb-4'>Model</h3>
        <select
          name='model'
          className='w-full p-2 rounded-md'
          value={filters.model}
          onChange={(e) => onFilterChange('model', e.target.value)}
          disabled={loading}
        >
          <option value='all'>All Models</option>
          {/* Use dynamic models from API when available, otherwise use static options */}
          {(dynamicFilterOptions.models.length > 0
            ? dynamicFilterOptions.models
            : filterOptions.model
          ).map((model) => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
        </select>
      </div>

      {/* Year */}
      <div className='bg-gray-100 p-4 rounded-md'>
        <h3 className='font-bold mb-4'>Year</h3>
        <select
          name='year'
          className='w-full p-2 rounded-md'
          value={filters.year}
          onChange={(e) => onFilterChange('year', e.target.value)}
          disabled={loading}
        >
          <option value='all'>All Years</option>
          {/* Use dynamic years from API when available, otherwise use static options */}
          {(dynamicFilterOptions.years.length > 0
            ? dynamicFilterOptions.years
            : filterOptions.year
          ).map((year) => (
            <option key={year} value={year.toString()}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* Price */}
      <div className='bg-gray-100 p-4 rounded-md'>
        <h3 className='font-bold mb-4'>Price</h3>
        <Slider
          value={sliderValue}
          onValueChange={handleSliderChange}
          max={100}
          step={1}
          className='my-4'
          disabled={loading}
        />
        <div className='text-sm text-gray-600 flex justify-between'>
          <span>R{filters.priceRange[0].toLocaleString()}</span>
          <span>R{filters.priceRange[1].toLocaleString()}</span>
        </div>
      </div>

      {loading && (
        <div className='text-center text-gray-500 text-sm'>
          Updating filters...
        </div>
      )}
    </form>
  )
}
