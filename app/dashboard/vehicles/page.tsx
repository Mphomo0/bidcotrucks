'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { AppSidebar } from '@/components/sections/dashboard/AppSidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { toast } from 'react-toastify'
import Link from 'next/link'
import Image from 'next/image'
import { PaginationControls } from '@/components/ui/pagination-controls'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Pencil, Trash2 } from 'lucide-react'

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
  description?: string
  slug?: string
  categoryId?: string
  images: Image[]
}

interface Image {
  fileId: string
  url: string
}

export default function Vehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [paginationMeta, setPaginationMeta] = useState({
    page: 1,
    limit: 5,
    totalPages: 1,
    total: 0,
  })
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({
    make: '',
    status: '',
  })
  const [showFilters, setShowFilters] = useState(false)

  const { data: session, status } = useSession()
  const router = useRouter()

  const fetchVehicles = async (page = 1, limit = 5) => {
    try {
      const params = new URLSearchParams()
      params.set('page', page.toString())
      params.set('limit', limit.toString())

      if (search) params.set('search', search)
      if (filters.make) params.set('make', filters.make)
      if (filters.status) params.set('status', filters.status)

      const res = await fetch(`/api/vehicles?${params.toString()}`)
      if (!res.ok) throw new Error('Failed to fetch vehicles')

      const response = await res.json()

      setVehicles(Array.isArray(response.data) ? response.data : [])
      setPaginationMeta(response.meta)
    } catch (error) {
      console.error(error)
      toast.error('Error loading vehicles')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    fetchVehicles(1, paginationMeta.limit)
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const applyFilters = () => {
    setLoading(true)
    fetchVehicles(1, paginationMeta.limit)
  }

  const clearFilters = () => {
    setSearch('')
    setFilters({ make: '', status: '' })
    setLoading(true)
    fetchVehicles(1, paginationMeta.limit)
  }

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
    fetchVehicles()
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className='flex h-screen items-center justify-center'>
        Loading...
      </div>
    )
  }

  if (!session) return null

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this vehicle?')) return

    try {
      // 1. Fetch the vehicle to get the image fileIds
      const res = await fetch(`/api/vehicles/${id}`)
      if (!res.ok) throw new Error('Failed to fetch vehicle details')

      const response = await res.json()

      // Extract the actual vehicle object from the nested response
      const vehicle = response.vehicle

      if (!vehicle) {
        console.error('Vehicle data not found in response:', response)
        throw new Error('Vehicle data not found in API response')
      }

      // Extract fileIds from the vehicle's image array
      if (!vehicle.images || !Array.isArray(vehicle.images)) {
        console.error('Vehicle images is not an array:', vehicle.images)
        throw new Error('Vehicle images data is invalid or missing')
      }

      const fileIds = vehicle.images
        .map((img: Image) => img.fileId)
        .filter(Boolean)

      // Batch delete from ImageKit (only if there are fileIds)
      if (fileIds.length > 0) {
        const response = await fetch('/api/delete-images', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ fileIds }),
        })

        if (!response.ok) {
          const err = await response.json()
          console.error('ImageKit delete error:', err)
          throw new Error('Failed to delete images from ImageKit')
        }

        console.log('Images deleted successfully from ImageKit')
      } else {
        console.log('No images to delete')
      }

      // 4. Delete the vehicle from your backend
      const vehicleDeleteRes = await fetch(`/api/vehicles/${id}`, {
        method: 'DELETE',
      })
      if (!vehicleDeleteRes.ok) throw new Error('Failed to delete vehicle')

      toast.success('Vehicle and associated images deleted successfully')
      fetchVehicles() // refresh the list
    } catch (error) {
      console.error('Delete operation failed:', error)
      toast.error('Error deleting vehicle and/or images')
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className='flex h-16 items-center gap-2 transition-[width,height] ease-linear'>
          <div className='flex items-center gap-2 px-4'>
            <SidebarTrigger className='-ml-1' />
            <Separator orientation='vertical' className='mr-2 h-4' />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className='hidden md:block text-black'>
                  <BreadcrumbLink
                    href='/dashboard'
                    className='hover:text-black'
                  >
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className='hidden md:block text-black' />
                <BreadcrumbItem>
                  <BreadcrumbPage className='text-black'>
                    Vehicles
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className='p-4 pt-0'>
          <div className='min-h-auto flex-1 rounded-xl bg-muted/50 px-4 py-4 top-8 w-full'>
            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full mt-8'>
              <h1 className='text-2xl font-bold mt-16 mb-0'>All Vehicles</h1>
              <Link
                href='/dashboard/vehicles/addVehicles'
                className='px-4 py-2 bg-[#24603a] text-white rounded mt-16'
              >
                Add Vehicle
              </Link>
            </div>

            <div className='mt-6 space-y-4'>
              <form onSubmit={handleSearch} className='flex flex-col sm:flex-row gap-3'>
                <Input
                  type='text'
                  placeholder='Search by name, make, model...'
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className='flex-1'
                />
                <Button type='submit' className='bg-[#24603a]'>
                  Search
                </Button>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => setShowFilters(!showFilters)}
                >
                  {showFilters ? 'Hide Filters' : 'Filters'}
                </Button>
              </form>

              {showFilters && (
                <div className='flex flex-wrap gap-3 p-4 bg-white rounded-lg border'>
                  <div className='flex-1 min-w-[150px]'>
                    <Select
                      value={filters.make}
                      onValueChange={(value) => handleFilterChange('make', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Select Make' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='all'>All Makes</SelectItem>
                        <SelectItem value='ISUZU'>ISUZU</SelectItem>
                        <SelectItem value='NISSAN'>NISSAN</SelectItem>
                        <SelectItem value='FAW'>FAW</SelectItem>
                        <SelectItem value='HINO'>HINO</SelectItem>
                        <SelectItem value='MERCEDES'>MERCEDES</SelectItem>
                        <SelectItem value='TOYOTA'>TOYOTA</SelectItem>
                        <SelectItem value='VOLKSWAGEN'>VOLKSWAGEN</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className='flex-1 min-w-[150px]'>
                    <Select
                      value={filters.status}
                      onValueChange={(value) => handleFilterChange('status', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Select Status' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='all'>All Status</SelectItem>
                        <SelectItem value='AVAILABLE'>Available</SelectItem>
                        <SelectItem value='SOLD'>Sold</SelectItem>
                        <SelectItem value='PENDING'>Pending</SelectItem>
                        <SelectItem value='RESERVED'>Reserved</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className='flex gap-2'>
                    <Button onClick={applyFilters} className='bg-[#24603a]'>
                      Apply
                    </Button>
                    <Button variant='outline' onClick={clearFilters}>
                      Clear
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {loading ? (
              <div className='flex justify-center items-center h-40'>
                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-[#24603a]'></div>
              </div>
            ) : vehicles.length === 0 ? (
              <div className='text-center py-8'>
                <p>No vehicles found.</p>
              </div>
            ) : (
              <Table className='w-full py-6 mb-8'>
                <TableCaption>A list of all registered vehicles.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Make</TableHead>
                    <TableHead>Model</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vehicles?.map((vehicle: Vehicle) => (
                    <TableRow key={vehicle.id}>
                      <TableCell>{vehicle.id}</TableCell>
                      <TableCell>
                        <Image
                          src={vehicle.images[0]?.url}
                          alt={vehicle.name}
                          width={100}
                          height={100}
                          className='w-16 h-16'
                        />
                      </TableCell>
                      <TableCell>{vehicle.name}</TableCell>
                      <TableCell>{vehicle.make}</TableCell>
                      <TableCell>{vehicle.model}</TableCell>
                      <TableCell>{vehicle.year}</TableCell>
                      <TableCell>{vehicle.price}</TableCell>
                      <TableCell className='flex gap-2 justify-center'>
                        <Link
                          href={`/dashboard/vehicles/edit/${vehicle.id}`}
                          className='p-2 text-blue-600 hover:bg-blue-50 rounded'
                          title='Edit'
                        >
                          <Pencil size={18} />
                        </Link>
                        <button
                          className='p-2 text-red-600 hover:bg-red-50 rounded'
                          onClick={() => handleDelete(vehicle.id)}
                          title='Delete'
                        >
                          <Trash2 size={18} />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            {/* Replace the previous pagination controls with this */}
            <PaginationControls
              currentPage={paginationMeta.page}
              totalPages={paginationMeta.totalPages}
              onPageChange={(page) => fetchVehicles(page, paginationMeta.limit)}
              limit={paginationMeta.limit}
              onLimitChange={(newLimit) => {
                fetchVehicles(1, newLimit)
              }}
              showLimitSelector={true}
            />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
