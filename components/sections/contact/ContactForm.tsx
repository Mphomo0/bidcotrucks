'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const contactFormSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  phone: z.string().regex(
    /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/, // Regex for validating international and local phone numbers
    {
      message: 'Invalid phone number.',
    }
  ),
  email: z.string().email({ message: 'Invalid email address' }),
  location: z.string().min(1, { message: 'Message is required' }),
  subject: z.string().min(1, { message: 'Subject is required' }),
  comment: z.string().min(10, { message: 'Message is required' }),
})

type ContactFormData = z.infer<typeof contactFormSchema>

export default function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  })

  // Handle form submission
  const onSubmit = (data: ContactFormData) => {
    console.log(data)
  }

  return (
    <>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <h1>Contact Form</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='grid grid-cols-1 md:grid-cols2 lg:grid-cols-2 gap-4'>
            {/* Name field */}
            <div>
              <label htmlFor='name' className='block mb-2'>
                Name
              </label>
              <input
                id='name'
                type='text'
                className='w-full p-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4'
                placeholder='Enter your Name'
                {...register('name')}
              />
              {errors.name && (
                <p className='text-red-500 text-sm mt-1'>
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Phone Number field */}
            <div>
              <label htmlFor='name' className='block mb-2'>
                Contact Number
              </label>
              <input
                id='phone'
                type='text'
                className='w-full p-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4'
                placeholder='Enter your Contact Number'
                {...register('phone')}
              />
              {errors.phone && (
                <p className='text-red-500 text-sm mt-1'>
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Email field */}
            <div>
              <label htmlFor='email' className='block mb-2'>
                Email
              </label>
              <input
                id='email'
                type='email'
                className='w-full p-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4'
                placeholder='Enter your Email'
                {...register('email')}
              />
              {errors.email && (
                <p className='text-red-500 text-sm mt-1'>
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Location field */}
            <div>
              <label htmlFor='location' className='block mb-2'>
                Location
              </label>
              <input
                id='location'
                type='text'
                className='w-full p-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4'
                placeholder='Enter your Contact Location'
                {...register('location')}
              />
              {errors.location && (
                <p className='text-red-500 text-sm mt-1'>
                  {errors.location.message}
                </p>
              )}
            </div>
          </div>

          {/* subject field */}
          <div>
            <label htmlFor='subject' className='block mb-2'>
              Subject
            </label>
            <select
              id='subject'
              className='w-full p-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4'
              {...register('subject')}
            >
              <option value=''>Select your Subject</option>
              <option value='corolla'>Buy A Truck</option>
              <option value='civic'>Finance</option>
              <option value='f150'>Other</option>
            </select>

            {errors.subject && (
              <p className='text-red-500 text-sm mt-1'>
                {errors.subject.message}
              </p>
            )}
          </div>

          {/* Comment field */}
          <div>
            <label htmlFor='comment' className='block mb-2'>
              Message
            </label>
            <textarea
              id='comment'
              rows={8}
              className='w-full p-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4'
              {...register('comment')}
            />
            {errors.comment && (
              <p className='text-red-500 text-sm mt-1'>
                {errors.comment.message}
              </p>
            )}
          </div>
          <div className='mb-24'>
            <button
              type='submit'
              className='bg-[#24603a] text-white font-bold py-3 px-6 rounded uppercase w-full md:w-1/6 lg:w-1/6'
            >
              SEND MESSAGE
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
