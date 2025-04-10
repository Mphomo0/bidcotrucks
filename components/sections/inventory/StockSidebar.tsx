import { useState } from 'react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'

export type FilterOptions = {
  vehicleType: string[]
  category: string[]
  manufacturer: string[]
}

export type FilterValues = {
  vehicleType: string
  category: string
  manufacturer: string
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
  const [sliderValue, setSliderValue] = useState<[number, number]>([
    ((filters.priceRange[0] - priceRange.min) /
      (priceRange.max - priceRange.min)) *
      100,
    ((filters.priceRange[1] - priceRange.min) /
      (priceRange.max - priceRange.min)) *
      100,
  ])
  const handleSliderChange = (value: number[]) => {
    setSliderValue(value as [number, number])
    const calculatedPrice = [
      Math.round(
        priceRange.min + (value[0] / 100) * (priceRange.max - priceRange.min)
      ),
      Math.round(
        priceRange.min + (value[1] / 100) * (priceRange.max - priceRange.min)
      ),
    ] as [number, number]
    onFilterChange('priceRange', calculatedPrice)
  }

  return (
    <div className='space-y-6'>
      {/* Product Type Filter */}
      <div className='bg-gray-100 p-4 rounded-md'>
        <h3 className='font-bold mb-4'>Vehicle Type</h3>
        <Select
          value={filters.vehicleType}
          onValueChange={(value) => onFilterChange('vehicleType', value)}
        >
          <SelectTrigger className='bg-white w-full py-6'>
            <SelectValue placeholder='Vehicle Type' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>Vehicle Type</SelectItem>
            {filterOptions.vehicleType.map((type) => (
              <SelectItem key={type} value={type.toLowerCase()}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Category Filter */}
      <div className='bg-gray-100 p-4 rounded-md'>
        <h3 className='font-bold mb-4'>Category</h3>
        <Select
          value={filters.category}
          onValueChange={(value) => onFilterChange('category', value)}
        >
          <SelectTrigger className='bg-white w-full py-6'>
            <SelectValue placeholder='All Branch' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>Category</SelectItem>
            {filterOptions.category.map((item) => (
              <SelectItem key={item} value={item.toLowerCase()}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Manufacturer Filter */}
      <div className='bg-gray-100 p-4 rounded-md'>
        <h3 className='font-bold mb-4'>Manufacturer</h3>
        <Select
          value={filters.manufacturer}
          onValueChange={(value) => onFilterChange('manufacturer', value)}
        >
          <SelectTrigger className='bg-white w-full py-6'>
            <SelectValue placeholder='All Manufacturer' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All Manufacturer</SelectItem>
            {filterOptions.manufacturer.map((brand) => (
              <SelectItem key={brand} value={brand.toLowerCase()}>
                {brand}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/*Model Filter */}
      <div className='bg-gray-100 p-4 rounded-md'>
        <h3 className='font-bold mb-4'>Model</h3>
        <Select
          value={filters.model}
          onValueChange={(value) => onFilterChange('model', value)}
        >
          <SelectTrigger className='bg-white'>
            <SelectValue placeholder='Model' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>Model</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Year Filter */}
      <div className='bg-gray-100 p-4 rounded-md'>
        <h3 className='font-bold mb-4'>Year</h3>
        <Select
          value={filters.year}
          onValueChange={(value) => onFilterChange('category', value)}
        >
          <SelectTrigger className='bg-white'>
            <SelectValue placeholder='All Category' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All Category</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Price Filter */}
      <div className='bg-gray-100 p-4 rounded-md'>
        <h3 className='font-bold mb-4'>Price</h3>
        <Slider
          value={sliderValue}
          onValueChange={handleSliderChange}
          max={100}
          step={1}
          className='my-4'
        />
        <div className='text-sm text-gray-600 flex justify-between'>
          <span>R{filters.priceRange[0].toLocaleString()}</span>
          <span>R{filters.priceRange[1].toLocaleString()}</span>
        </div>
      </div>
    </div>
  )
}
