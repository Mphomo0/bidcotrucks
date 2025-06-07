'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'react-toastify'
import UploadMultiple from '@/components/sections/dashboard/UploadMultiple'
import { upload } from '@imagekit/next'
import { v4 as uuidv4 } from 'uuid'
import { useRouter } from 'next/navigation'

// Updated schema to expect array of objects
const addVehicleSchema = z.object({
  name: z.string().min(2, { message: 'Name is required' }),
  make: z.string().min(2, { message: 'Make is required' }),
  model: z.string().min(2, { message: 'Model is required' }),
  year: z.coerce.number().min(1900, { message: 'Enter a valid year' }),
  price: z.coerce.number().min(1),
  mileage: z.coerce.number().min(0).optional(),
  fuelType: z.string().min(3).optional(),
  condition: z.string().min(3),
  transmission: z.string().min(3).optional(),
  status: z.string().min(3),
  description: z.string().min(3),
  categoryId: z.string().min(3),
  images: z
    .array(
      z.object({
        url: z.string().url(),
        fileId: z.string().min(1),
      })
    )
    .optional(),
})

type AddVehicleForm = z.infer<typeof addVehicleSchema>

interface Category {
  id: string
  name: string
}

export default function CreateVehicle() {
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedFiles, setSelectedFiles] = useState<File[] | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<AddVehicleForm>({
    resolver: zodResolver(addVehicleSchema),
    defaultValues: {
      fuelType: undefined,
      transmission: undefined,
      mileage: undefined,
      images: [],
    },
  })

  const router = useRouter()

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch('/api/category')
      const data = await res.json()
      setCategories(data.categories || [])
    }
    fetchCategories()
  }, [])

  const getAuthParams = async () => {
    const res = await fetch('/api/upload-auth')
    if (!res.ok) throw new Error('Failed to fetch upload auth')
    return res.json()
  }

  const onSubmit = async (data: AddVehicleForm) => {
    try {
      if (!selectedFiles || selectedFiles.length === 0) {
        toast.error('Please select at least one image.')
        return
      }

      setIsUploading(true)

      // Create a unique subfolder for this vehicle
      // const vehicleFolder = `inventory/${uuidv4()}`
      const uploadedImages: { url: string; fileId: string }[] = []

      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i]
        const { token, signature, publicKey, expire } = await getAuthParams()
        const uniqueFileName = `${uuidv4()}_${file.name}`

        try {
          const res = await upload({
            file,
            fileName: uniqueFileName,
            folder: 'inventory',
            expire,
            token,
            signature,
            publicKey,
          })
          if (!res || !res.url || !res.fileId)
            throw new Error(`Upload failed for ${file.name}`)

          uploadedImages.push({ url: res.url, fileId: res.fileId })
        } catch (err) {
          console.error(err)
          toast.error(`Failed to upload ${file.name}`)
        }
      }

      setIsUploading(false)

      if (uploadedImages.length === 0) {
        toast.error('All uploads failed. Please try again.')
        return
      }

      setValue('images', uploadedImages, { shouldValidate: true })

      const payload = {
        ...data,
        images: uploadedImages,
        fuelType: data.fuelType?.toUpperCase() ?? null,
        condition: data.condition.toUpperCase(),
        transmission: data.transmission?.toUpperCase() ?? null,
        status: data.status.toUpperCase(),
      }

      const res = await fetch('/api/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        toast.success('Vehicle created successfully!')
        setSelectedFiles(null)
        router.push('/dashboard/vehicles')
      } else {
        const err = await res.json()
        toast.error(err.error || 'Failed to create vehicle')
      }
    } catch (err) {
      console.error(err)
      toast.error('Something went wrong')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className='max-w-4xl mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold mb-8 text-center'>Add Vehicle</h1>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
        <div className='space-y-2'>
          <label htmlFor='name'>Name</label>
          <Input
            id='name'
            {...register('name')}
            className='px-2 py-6'
            placeholder='Enter vehicle name'
          />
          {errors.name && <p className='text-red-500'>{errors.name.message}</p>}
        </div>

        {/* Make & Model */}
        <div className='grid md:grid-cols-2 gap-6'>
          <div className='space-y-2'>
            <label htmlFor='make'>Make</label>
            <Input
              id='make'
              {...register('make')}
              className='px-2 py-6'
              placeholder='Enter vehicle make'
            />
            {errors.make && (
              <p className='text-red-500'>{errors.make.message}</p>
            )}
          </div>
          <div className='space-y-2'>
            <label htmlFor='model'>Model</label>
            <Input
              id='model'
              {...register('model')}
              className='px-2 py-6'
              placeholder='Enter vehicle model'
            />
            {errors.model && (
              <p className='text-red-500'>{errors.model.message}</p>
            )}
          </div>
        </div>

        {/* Year & Price */}
        <div className='grid md:grid-cols-2 gap-6'>
          <div className='space-y-2'>
            <label htmlFor='year'>Year</label>
            <Input
              id='year'
              {...register('year')}
              className='px-2 py-6'
              placeholder='Enter vehicle year'
            />
            {errors.year && (
              <p className='text-red-500'>{errors.year.message}</p>
            )}
          </div>
          <div className='space-y-2'>
            <label htmlFor='price'>Price</label>
            <Input
              id='price'
              {...register('price')}
              className='px-2 py-6'
              placeholder='Enter vehicle price'
            />
            {errors.price && (
              <p className='text-red-500'>{errors.price.message}</p>
            )}
          </div>
        </div>

        {/* Fuel Type, Mileage, Condition */}
        <div className='grid md:grid-cols-3 gap-6'>
          <div className='space-y-2'>
            <label>Fuel Type</label>
            <Controller
              control={control}
              name='fuelType'
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className='w-full px-2 py-6'>
                    <SelectValue placeholder='Select Fuel Type' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='diesel'>Diesel</SelectItem>
                    <SelectItem value='petrol'>Petrol</SelectItem>
                    <SelectItem value='electric'>Electric</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.fuelType && (
              <p className='text-red-500'>{errors.fuelType.message}</p>
            )}
          </div>

          <div className='space-y-2'>
            <label htmlFor='mileage'>Mileage</label>
            <Input
              id='mileage'
              {...register('mileage')}
              className='w-full px-2 py-6'
              placeholder='Enter vehicle mileage'
            />
            {errors.mileage && (
              <p className='text-red-500'>{errors.mileage.message}</p>
            )}
          </div>

          <div className='space-y-2'>
            <label>Condition</label>
            <Controller
              control={control}
              name='condition'
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className='w-full px-2 py-6'>
                    <SelectValue placeholder='Select Condition' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='used'>Used</SelectItem>
                    <SelectItem value='new'>New</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.condition && (
              <p className='text-red-500'>{errors.condition.message}</p>
            )}
          </div>
        </div>

        {/* Transmission, Category, Status */}
        <div className='grid md:grid-cols-3 gap-6'>
          <div className='space-y-2'>
            <label>Transmission</label>
            <Controller
              control={control}
              name='transmission'
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className='w-full px-2 py-6'>
                    <SelectValue placeholder='Select Transmission' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='manual'>Manual</SelectItem>
                    <SelectItem value='automatic'>Automatic</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.transmission && (
              <p className='text-red-500'>{errors.transmission.message}</p>
            )}
          </div>

          <div className='space-y-2'>
            <label>Category</label>
            <Controller
              control={control}
              name='categoryId'
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className='w-full px-2 py-6'>
                    <SelectValue placeholder='Select Category' />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.categoryId && (
              <p className='text-red-500'>{errors.categoryId.message}</p>
            )}
          </div>

          <div className='space-y-2'>
            <label>Status</label>
            <Controller
              control={control}
              name='status'
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className='w-full px-2 py-6'>
                    <SelectValue placeholder='Select Status' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='available'>Available</SelectItem>
                    <SelectItem value='sold'>Sold</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.status && (
              <p className='text-red-500'>{errors.status.message}</p>
            )}
          </div>
        </div>

        {/* Images */}
        <div>
          <label>Images</label>
          <UploadMultiple
            onFilesSelected={(files) => setSelectedFiles(files)}
          />
        </div>

        {/* Description */}
        <div className='space-y-2'>
          <label htmlFor='description'>Description</label>
          <Textarea
            id='description'
            rows={10}
            {...register('description')}
            placeholder='Enter detailed description...'
            className='min-h-[240px]'
          />
          {errors.description && (
            <p className='text-red-500'>{errors.description.message}</p>
          )}
        </div>

        {/* Submit */}
        <Button
          type='submit'
          disabled={isSubmitting || isUploading}
          className='w-full bg-green-600 hover:bg-green-700 text-white py-6 rounded uppercase font-semibold'
        >
          {isSubmitting || isUploading ? 'Creating...' : 'Create Vehicle'}
        </Button>
      </form>
    </div>
  )
}
