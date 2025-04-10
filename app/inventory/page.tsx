'use client'

import React, { useState, useEffect } from 'react'
import { Grid, List } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import PageWrapper from '@/components/ui/layout/PageWrapper'
import StockSidebar from '@/components/sections/inventory/StockSidebar'
import StockCard from '@/components/sections/inventory/StockCard'
import stockData from '@/lib/stockdata'

interface FilterOptions {
  vehicleType: string[]
  category: string[]
  manufacturer: string[]
}

interface FilterValues {
  vehicleType: string
  category: string
  manufacturer: string
  model: string
  year: string
  priceRange: [number, number]
}

//FilterOptions
const filterOptions: FilterOptions = {
  vehicleType: ['Truck', 'Trailer', 'Plant'],
  category: ['Cranes', 'Grader', 'Excavators'],
  manufacturer: ['Isuzu', 'Mercedes', 'Volvo'],
}

export default function Inventory() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const [sortBy, setSortBy] = useState<string>('date')
  const [filteredProducts, setFilteredProducts] = useState(stockData)
  const [totalProducts, setTotalProducts] = useState(18) // Total count from the API

  // Filter state
  const [filters, setFilters] = useState<FilterValues>({
    vehicleType: 'all',
    category: 'all',
    manufacturer: 'all',
    model: 'all',
    year: 'all',
    priceRange: [0, 2000000],
  })

  // Handle filter changes
  const handleFilterChange = (
    key: keyof FilterValues,
    value: FilterValues[keyof FilterValues]
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  // Apply filters
  useEffect(() => {
    let filtered = [...stockData]

    // Apply filters
    if (filters.vehicleType !== 'all') {
      filtered = filtered.filter((p) =>
        p.title.toLowerCase().includes(filters.vehicleType)
      )
    }

    // Apply price filter
    filtered = filtered.filter((p) => {
      // Extract numeric value from price
      const priceValue = p.price.value.replace(/[^0-9]/g, '')
      const price = priceValue ? Number.parseInt(priceValue, 10) : 0

      return price >= filters.priceRange[0] && price <= filters.priceRange[1]
    })

    // Apply sorting
    if (sortBy === 'price-low') {
      filtered.sort((a, b) => {
        const priceA = a.price.value.replace(/[^0-9]/g, '')
        const priceB = b.price.value.replace(/[^0-9]/g, '')
        return (
          (Number.parseInt(priceA, 10) || 0) -
          (Number.parseInt(priceB, 10) || 0)
        )
      })
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => {
        const priceA = a.price.value.replace(/[^0-9]/g, '')
        const priceB = b.price.value.replace(/[^0-9]/g, '')
        return (
          (Number.parseInt(priceB, 10) || 0) -
          (Number.parseInt(priceA, 10) || 0)
        )
      })
    } else if (sortBy === 'name') {
      filtered.sort((a, b) => a.title.localeCompare(b.title))
    }

    setFilteredProducts(filtered)
    setTotalProducts(filtered.length)
  }, [filters, sortBy])

  // Handle view more button click
  const handleViewMore = () => {
    console.log('View more clicked')
    // Navigate to product detail page or open modal
  }

  return (
    <>
      <PageWrapper
        heading='Welcome To Our Company'
        title='Our Inventory'
        link={{ href: '/inventory', text: 'Our Inventory' }}
      ></PageWrapper>
      <div className='container mx-auto py-8 px-4'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          {/* Sidebar Filters */}
          <div className='md:col-span-1'>
            <StockSidebar
              filterOptions={filterOptions}
              filters={filters}
              onFilterChange={handleFilterChange}
              priceRange={{ min: 0, max: 2000000 }} // Make this consistent
            />
          </div>

          {/* Product Listing */}
          <div className='md:col-span-3'>
            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4'>
              <div className='text-lg font-medium'>
                {totalProducts} Products Available
              </div>
              <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4'>
                <div className='flex items-center'>
                  <span className='mr-2 whitespace-nowrap'>Sort By</span>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className='w-[180px]'>
                      <SelectValue placeholder='Sort by' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='date'>Date: Newest First</SelectItem>
                      <SelectItem value='price-low'>
                        Price: Low to High
                      </SelectItem>
                      <SelectItem value='price-high'>
                        Price: High to Low
                      </SelectItem>
                      <SelectItem value='name'>Name: A to Z</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className='flex gap-1'>
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size='icon'
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className='h-4 w-4' />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size='icon'
                    onClick={() => setViewMode('list')}
                  >
                    <List className='h-4 w-4' />
                  </Button>
                </div>
              </div>
            </div>

            <div
              className={`${
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 gap-6'
                  : 'space-y-6'
              }`}
            >
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <StockCard
                    key={product.id}
                    {...product}
                    status={
                      product.status === 'available' ||
                      product.status === 'sold'
                        ? product.status
                        : undefined
                    }
                    viewMode={viewMode}
                    onViewMore={handleViewMore}
                    badge={{
                      ...product.badge,
                      position:
                        product.badge.position === 'left' ||
                        product.badge.position === 'right'
                          ? product.badge.position
                          : undefined,
                    }}
                  />
                ))
              ) : (
                <div className='col-span-full text-center py-12 bg-gray-50 rounded-lg'>
                  <p className='text-lg text-gray-500'>
                    No products match your current filters.
                  </p>
                  <Button
                    variant='outline'
                    className='mt-4'
                    onClick={() =>
                      setFilters({
                        vehicleType: 'all',
                        category: 'all',
                        manufacturer: 'all',
                        model: 'all',
                        year: 'all',
                        priceRange: [0, 2000000],
                      })
                    }
                  >
                    Reset Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
