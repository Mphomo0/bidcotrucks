'use client'

import type React from 'react'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { Trash2, Upload } from 'lucide-react'
import { AppSidebar } from '@/components/sections/dashboard/AppSidebar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { v4 as uuidv4 } from 'uuid'
import { upload } from '@imagekit/next'

interface VehicleImage {
  url: string
}

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
  images: VehicleImage[]
}

interface Category {
  id: string
  name: string
}

export default function EditVehiclePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const params = useParams()
  const vehicleId = params.id as string

  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<Category[]>([])
  const [uploadingImages] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previewImages, setPreviewImages] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<Vehicle>({
    defaultValues: {
      images: [],
    },
  })

  const watchedImages = watch('images') || []

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }

    const fetchVehicle = async () => {
      try {
        const res = await fetch(`/api/vehicles/${vehicleId}`)
        if (!res.ok) throw new Error('Failed to fetch vehicle')
        const data = await res.json()
        reset(data.vehicle)
      } catch (error) {
        console.error('Error fetching vehicle:', error)
        toast.error('Failed to load vehicle data')
      } finally {
        setLoading(false)
      }
    }

    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/category')
        if (!res.ok) throw new Error('Failed to fetch categories')
        const data = await res.json()
        setCategories(data.categories || [])
      } catch (error) {
        console.error('Error fetching categories:', error)
        toast.error('Failed to load categories')
      }
    }

    if (vehicleId) {
      fetchVehicle()
      fetchCategories()
    }
  }, [status, router, vehicleId, reset])

  useEffect(() => {
    return () => {
      // Clean up preview URLs when component unmounts
      previewImages.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [previewImages])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    // Clean up previous preview URLs
    previewImages.forEach((url) => URL.revokeObjectURL(url))

    // Create new preview URLs for selected files
    const newFiles = Array.from(files)
    setSelectedFiles(newFiles)

    // Generate preview URLs
    const previews = newFiles.map((file) => URL.createObjectURL(file))
    setPreviewImages(previews)
  }

  const removeImage = (index: number) => {
    const currentImages = [...watchedImages]
    currentImages.splice(index, 1)
    setValue('images', currentImages)
  }

  const removePreviewImage = (index: number) => {
    // Revoke the URL to prevent memory leaks
    URL.revokeObjectURL(previewImages[index])

    // Remove from state
    const newFiles = selectedFiles.filter((_, i) => i !== index)
    const newPreviews = previewImages.filter((_, i) => i !== index)

    setSelectedFiles(newFiles)
    setPreviewImages(newPreviews)
  }

  const getAuthParams = async () => {
    const res = await fetch('/api/upload-auth')
    if (!res.ok) throw new Error('Failed to fetch upload authentication')
    return res.json()
  }

  const onSubmit = async (formData: Vehicle) => {
    try {
      setIsUploading(true)

      // Upload new images if any selected
      const newUploadedImages: VehicleImage[] = []

      if (selectedFiles.length > 0) {
        for (const file of selectedFiles) {
          try {
            const { token, signature, publicKey, expire } =
              await getAuthParams()
            const uniqueFileName = `${uuidv4()}_${file.name}`

            const res = await upload({
              file,
              fileName: uniqueFileName,
              folder: 'inventory',
              expire,
              token,
              signature,
              publicKey,
            })

            if (!res || !res.url)
              throw new Error(`Upload failed for ${file.name}`)

            newUploadedImages.push({ url: res.url })
          } catch (err) {
            console.error(err)
            toast.error(`Failed to upload ${file.name}`)
          }
        }
      }

      // Combine existing images with newly uploaded ones
      const allImages = [...watchedImages, ...newUploadedImages]

      // Update the formData with all images
      const updatedFormData = {
        ...formData,
        images: allImages,
      }

      const res = await fetch(`/api/vehicles/${vehicleId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFormData),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData?.message || 'Failed to update vehicle')
      }

      // Clean up preview URLs
      previewImages.forEach((url) => URL.revokeObjectURL(url))

      toast.success('Vehicle updated successfully')
      router.push('/dashboard/vehicles')
    } catch (error) {
      console.error('PUT request error:', error)
      toast.error(
        error instanceof Error ? error.message : 'Failed to update vehicle'
      )
    } finally {
      setIsUploading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4'></div>
          <p>Loading vehicle data...</p>
        </div>
      </div>
    )
  }

  if (!session) return null

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className='flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12'>
          <div className='flex items-center gap-2 px-4'>
            <SidebarTrigger className='-ml-1' />
            <Separator orientation='vertical' className='mr-2 h-4' />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className='text-black'>
                  <BreadcrumbLink href='/dashboard'>Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className='text-black' />
                <BreadcrumbItem>
                  <BreadcrumbPage className='text-black'>
                    Edit Vehicle
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className='p-4 pt-0'>
          <div className='min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min'>
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
                    <p className='text-red-500 text-sm'>
                      {errors.name.message}
                    </p>
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
                      <p className='text-red-500 text-sm'>
                        {errors.make.message}
                      </p>
                    )}
                  </div>
                  <div className='space-y-2'>
                    <label
                      htmlFor='model'
                      className='block text-sm font-medium'
                    >
                      Model
                    </label>
                    <input
                      id='model'
                      {...register('model', { required: 'Model is required' })}
                      className='w-full p-2 border rounded'
                    />
                    {errors.model && (
                      <p className='text-red-500 text-sm'>
                        {errors.model.message}
                      </p>
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
                      <p className='text-red-500 text-sm'>
                        {errors.year.message}
                      </p>
                    )}
                  </div>
                  <div className='space-y-2'>
                    <label
                      htmlFor='price'
                      className='block text-sm font-medium'
                    >
                      Price
                    </label>
                    <input
                      id='price'
                      type='number'
                      {...register('price', { required: 'Price is required' })}
                      className='w-full p-2 border rounded'
                    />
                    {errors.price && (
                      <p className='text-red-500 text-sm'>
                        {errors.price.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Fuel Type, Mileage, Condition */}
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                  <div className='space-y-2'>
                    <label
                      htmlFor='fuelType'
                      className='block text-sm font-medium'
                    >
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
                      <p className='text-red-500 text-sm'>
                        {errors.fuelType.message}
                      </p>
                    )}
                  </div>

                  <div className='space-y-2'>
                    <label
                      htmlFor='mileage'
                      className='block text-sm font-medium'
                    >
                      Mileage
                    </label>
                    <input
                      id='mileage'
                      type='number'
                      {...register('mileage', {
                        required: 'Mileage is required',
                      })}
                      className='w-full p-2 border rounded'
                    />
                    {errors.mileage && (
                      <p className='text-red-500 text-sm'>
                        {errors.mileage.message}
                      </p>
                    )}
                  </div>

                  <div className='space-y-2'>
                    <label
                      htmlFor='condition'
                      className='block text-sm font-medium'
                    >
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
                      <p className='text-red-500 text-sm'>
                        {errors.condition.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Transmission, Category, Status */}
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                  <div className='space-y-2'>
                    <label
                      htmlFor='transmission'
                      className='block text-sm font-medium'
                    >
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
                    <label
                      htmlFor='categoryId'
                      className='block text-sm font-medium'
                    >
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
                    <label
                      htmlFor='status'
                      className='block text-sm font-medium'
                    >
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
                      <p className='text-red-500 text-sm'>
                        {errors.status.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Images Section */}
                <div className='space-y-4'>
                  <Label>Vehicle Images</Label>

                  {/* Display Current Images */}
                  {watchedImages.length > 0 && (
                    <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                      {watchedImages.map((img, idx) => (
                        <div key={idx} className='relative group'>
                          <div className='aspect-square relative overflow-hidden rounded-lg border'>
                            <Image
                              src={img.url || '/placeholder.svg'}
                              alt={`Vehicle image ${idx + 1}`}
                              width={200}
                              height={200}
                              className='object-cover'
                            />
                          </div>
                          <Button
                            type='button'
                            variant='destructive'
                            size='sm'
                            className='absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity'
                            onClick={() => removeImage(idx)}
                          >
                            <Trash2 className='h-3 w-3' />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Upload New Images */}
                  <div className='border-2 border-dashed border-muted-foreground/25 rounded-lg p-6'>
                    <div className='text-center'>
                      <Upload className='mx-auto h-12 w-12 text-muted-foreground/50' />
                      <div className='mt-4'>
                        <Label htmlFor='imageUpload' className='cursor-pointer'>
                          <span className='text-sm font-medium text-primary hover:text-primary/80'>
                            Click to upload images
                          </span>
                          <Input
                            id='imageUpload'
                            type='file'
                            accept='image/*'
                            multiple
                            className='hidden'
                            onChange={handleImageUpload}
                            disabled={uploadingImages || isUploading}
                          />
                        </Label>
                        <p className='text-xs text-muted-foreground mt-1'>
                          PNG, JPG, GIF up to 10MB each
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Preview Selected Images */}
                  {previewImages.length > 0 && (
                    <div className='space-y-2'>
                      <Label className='text-sm text-muted-foreground'>
                        New Images (will be uploaded when you save)
                      </Label>
                      <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                        {previewImages.map((previewUrl, idx) => (
                          <div key={idx} className='relative group'>
                            <div className='aspect-square relative overflow-hidden rounded-lg border-2 border-dashed border-primary/50'>
                              <Image
                                src={previewUrl || '/placeholder.svg'}
                                alt={`Preview ${idx + 1}`}
                                width={200}
                                height={200}
                                className='object-cover'
                              />
                              <div className='absolute inset-0 bg-primary/10'></div>
                            </div>
                            <Button
                              type='button'
                              variant='destructive'
                              size='sm'
                              className='absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity'
                              onClick={() => removePreviewImage(idx)}
                            >
                              <Trash2 className='h-3 w-3' />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className='space-y-2'>
                  <label
                    htmlFor='description'
                    className='block text-sm font-medium'
                  >
                    Description
                  </label>
                  <textarea
                    id='description'
                    rows={6}
                    {...register('description')}
                    className='w-full p-2 border rounded resize-none'
                  />
                  {errors.description && (
                    <p className='text-red-500 text-sm'>
                      {errors.description.message}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type='submit'
                  disabled={isSubmitting || isUploading}
                  className='w-full bg-green-600 hover:bg-green-700 text-white p-4 text-md rounded'
                >
                  {isSubmitting || isUploading
                    ? isUploading
                      ? 'Uploading Images...'
                      : 'Updating...'
                    : 'Update Vehicle'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
