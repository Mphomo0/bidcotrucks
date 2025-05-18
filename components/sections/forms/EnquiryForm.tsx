'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'react-toastify'

const enquiryFormSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  phone: z.string().regex(
    /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/, // Regex for validating international and local phone numbers
    {
      message: 'Invalid phone number.',
    }
  ),
  message: z.string().min(10, { message: 'Message is required' }),
})

type EnquiryFormData = z.infer<typeof enquiryFormSchema>

export default function EnquiryForm({ vehicleName }: { vehicleName: string }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EnquiryFormData>({
    resolver: zodResolver(enquiryFormSchema),
  })

  const onSubmit = async (data: EnquiryFormData) => {
    try {
      const response = await fetch('/api/send-email/general', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: 'Enquiry', ...data }),
      })

      const result = await response.json()

      if (response.ok) {
        toast.success('Message sent successfully!')
        reset()
      } else {
        toast.error(`Error: ${result.message || 'Something went wrong'}`)
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      toast.error('Failed to send message. Please try again later.')
    }
  }

  return (
    <div>
      <h2 className='text-xl font-semibold mb-2'>Enquiry Form</h2>
      <form className='space-y-4' onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className='block text-sm font-medium'>Name & Surname</label>
          <input
            type='text'
            className='w-full border px-3 py-2 rounded'
            {...register('name')}
          />
          {errors.name && <p className='text-red-500'>{errors.name.message}</p>}
        </div>

        <div>
          <label className='block text-sm font-medium'>Email</label>
          <input
            type='email'
            className='w-full border px-3 py-2 rounded'
            {...register('email')}
          />
          {errors.email && (
            <p className='text-red-500'>{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className='block text-sm font-medium'>Contact Number</label>
          <input
            type='tel'
            className='w-full border px-3 py-2 rounded'
            {...register('phone')}
          />
          {errors.phone && (
            <p className='text-red-500'>{errors.phone.message}</p>
          )}
        </div>

        <div>
          <label className='block text-sm font-medium'>Message</label>
          <textarea
            className='w-full border px-3 py-2 rounded'
            rows={4}
            defaultValue={`I would like to check the availability of the ${vehicleName}`}
            {...register('message')}
          />
          {errors.message && (
            <p className='text-red-500'>{errors.message.message}</p>
          )}
        </div>

        <button
          type='submit'
          className='w-full bg-[#24603a] text-white py-2 rounded'
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Send Enquiry'}
        </button>
      </form>
    </div>
  )
}
