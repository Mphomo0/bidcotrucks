'use client'

import type React from 'react'
import { useState, useEffect } from 'react'
import { Grid, List, Search } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PaginationControls } from '@/components/ui/pagination-controls'
import PageWrapper from '@/components/ui/layout/PageWrapper'
import StockSidebar, {
  type FilterOptions,
  type FilterValues,
} from '@/components/sections/inventory/StockSidebar'
import StockCard from '@/components/sections/inventory/StockCard'

type InventoryItem = {
  id: string
  name: string
  make: string
  model: string
  year: number
  price: number
  mileage: number
  fuelType: 'PETROL' | 'DIESEL'
  condition: 'NEW' | 'USED'
  transmission: 'AUTOMATIC' | 'MANUAL'
  images: { url: string }[]
  status: 'AVAILABLE' | 'SOLD'
  description: string
  slug: string
  categoryId: string
}

type PaginationMeta = {
  total: number
  page: number
  limit: number
  totalPages: number
}

export default function Inventory() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const initialPage = Number(searchParams.get('page') || '1')
  const initialLimit = Number(searchParams.get('limit') || '10')
  const initialSearch = searchParams.get('search') || ''
  const initialSort = searchParams.get('sort') || 'date'

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const [sortBy, setSortBy] = useState(initialSort)
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([])
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta>({
    total: 0,
    page: initialPage,
    limit: initialLimit,
    totalPages: 0,
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState(initialSearch)
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(initialSearch)
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    category: [],
    make: [],
    model: [],
    year: [],
  })
  const [filters, setFilters] = useState<FilterValues>({
    category: searchParams.get('category') || 'all',
    make: searchParams.get('make') || 'all',
    model: searchParams.get('model') || 'all',
    year: searchParams.get('year') || 'all',
    priceRange: [0, 2000000],
  })

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 400)
    return () => clearTimeout(handler)
  }, [searchTerm])

  // Update URL
  const updateUrl = (
    currentFilters: FilterValues,
    page: number,
    limit: number,
    sort: string,
    search: string
  ) => {
    const params = new URLSearchParams()
    if (page > 1) params.set('page', page.toString())
    if (limit !== 10) params.set('limit', limit.toString())
    if (sort !== 'date') params.set('sort', sort)
    if (search) params.set('search', search)
    if (currentFilters.category !== 'all')
      params.set('category', currentFilters.category)
    if (currentFilters.make !== 'all') params.set('make', currentFilters.make)
    if (currentFilters.model !== 'all')
      params.set('model', currentFilters.model)
    if (currentFilters.year !== 'all') params.set('year', currentFilters.year)

    router.replace(
      `/inventory${params.toString() ? `?${params.toString()}` : ''}`
    )
  }

  // Fetch inventory data
  const fetchInventory = async (
    currentPage = 1,
    currentLimit = 10,
    currentFilters = filters,
    currentSort = sortBy,
    currentSearch = debouncedSearchTerm
  ) => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      params.set('page', currentPage.toString())
      params.set('limit', currentLimit.toString())
      if (currentSearch) params.set('search', currentSearch)
      if (currentFilters.category !== 'all')
        params.set('category', currentFilters.category)
      if (currentFilters.make !== 'all') params.set('make', currentFilters.make)
      if (currentFilters.model !== 'all')
        params.set('model', currentFilters.model)
      if (currentFilters.year !== 'all') params.set('year', currentFilters.year)
      if (currentFilters.priceRange[0] > 0)
        params.set('minPrice', currentFilters.priceRange[0].toString())
      if (currentFilters.priceRange[1] < 2000000)
        params.set('maxPrice', currentFilters.priceRange[1].toString())

      const sortMapping: Record<string, string> = {
        date: 'createdAt:desc',
        'price-low': 'price:asc',
        'price-high': 'price:desc',
        name: 'name:asc',
      }
      params.set('sort', sortMapping[currentSort] || 'createdAt:desc')

      const res = await fetch(`/api/vehicles/inventory?${params.toString()}`)
      const data = await res.json()

      setInventoryData(data.data)
      setPaginationMeta({ ...data.meta, limit: currentLimit })
      updateUrl(
        currentFilters,
        currentPage,
        currentLimit,
        currentSort,
        currentSearch
      )
    } catch (err) {
      console.error('Error fetching inventory:', err)
    } finally {
      setLoading(false)
    }
  }

  // Initial and reactive fetch
  useEffect(() => {
    fetchInventory(
      paginationMeta.page,
      paginationMeta.limit,
      filters,
      sortBy,
      debouncedSearchTerm
    )
  }, [
    paginationMeta.page,
    paginationMeta.limit,
    filters,
    sortBy,
    debouncedSearchTerm,
  ])

  // Fetch filter options once
  useEffect(() => {
    fetch('/api/filters')
      .then((res) => res.json())
      .then((data) =>
        setFilterOptions({
          category: data.categories,
          make: data.makes,
          model: data.models,
          year: data.years.map(String),
        })
      )
      .catch((err) => console.error('Failed to fetch filters', err))
  }, [])

  const handleFilterChange = (
    key: keyof FilterValues,
    value: FilterValues[keyof FilterValues]
  ) => {
    const updated = { ...filters, [key]: value }
    setFilters(updated)
    setPaginationMeta((prev) => ({ ...prev, page: 1 }))
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)
    setPaginationMeta((prev) => ({ ...prev, page: 1 }))
  }

  const handlePageChange = (newPage: number) =>
    setPaginationMeta((prev) => ({ ...prev, page: newPage }))

  const handleLimitChange = (newLimit: number) =>
    setPaginationMeta({ ...paginationMeta, page: 1, limit: newLimit })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPaginationMeta((prev) => ({ ...prev, page: 1 }))
  }

  const handleViewMore = (slug: string) => router.push(`/inventory/${slug}`)

  return (
    <>
      <PageWrapper
        heading='Welcome To Our Company'
        title='Our Inventory'
        link={{ href: '/inventory', text: 'Our Inventory' }}
      />
      <div className='container mx-auto py-8 px-4'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          <div className='md:col-span-1'>
            <StockSidebar
              filterOptions={filterOptions}
              filters={filters}
              onFilterChange={handleFilterChange}
              priceRange={{ min: 0, max: 2000000 }}
            />
          </div>
          <div className='md:col-span-3'>
            <div className='flex flex-col gap-4 mb-6'>
              <form
                onSubmit={handleSearch}
                className='flex w-full items-center space-x-2'
              >
                <Input
                  type='text'
                  placeholder='Search inventory...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='flex-1'
                />
                <Button type='submit' variant='outline' size='icon'>
                  <Search className='h-4 w-4' />
                </Button>
              </form>

              <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
                <div className='text-lg font-medium'>
                  {loading
                    ? 'Loading...'
                    : `${paginationMeta.total} Products Available`}
                </div>
                <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4'>
                  <div className='flex items-center'>
                    <span className='mr-2 whitespace-nowrap'>Sort By</span>
                    <Select value={sortBy} onValueChange={handleSortChange}>
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
            </div>

            {loading ? (
              <div className='col-span-full text-center py-12 bg-gray-50 rounded-lg'>
                <p className='text-lg text-gray-500'>Loading inventory...</p>
              </div>
            ) : (
              <>
                <div
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                      : 'space-y-6'
                  }
                >
                  {inventoryData.length > 0 ? (
                    inventoryData.map((vehicle) => (
                      <StockCard
                        key={vehicle.id}
                        id={vehicle.id}
                        name={vehicle.name}
                        slug={vehicle.slug}
                        price={vehicle.price}
                        mileage={vehicle.mileage}
                        fuelType={vehicle.fuelType}
                        transmission={vehicle.transmission}
                        status={vehicle.status}
                        viewMode={viewMode}
                        onViewMore={handleViewMore}
                        imageUrl={vehicle.images[0]?.url}
                        badge={{
                          text: vehicle.condition === 'NEW' ? 'New' : '',
                          position: 'left',
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
                        onClick={() => {
                          const reset = {
                            category: 'all',
                            make: 'all',
                            model: 'all',
                            year: 'all',
                            priceRange: [0, 2000000] as [number, number],
                          }
                          setFilters(reset)
                          setSearchTerm('')
                          setPaginationMeta({
                            page: 1,
                            limit: 10,
                            total: 0,
                            totalPages: 0,
                          })
                        }}
                      >
                        Reset Filters
                      </Button>
                    </div>
                  )}
                </div>

                {paginationMeta.totalPages > 1 && (
                  <div className='mt-8'>
                    <PaginationControls
                      currentPage={paginationMeta.page}
                      totalPages={paginationMeta.totalPages}
                      onPageChange={handlePageChange}
                      limit={paginationMeta.limit}
                      onLimitChange={handleLimitChange}
                      showLimitSelector={true}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
