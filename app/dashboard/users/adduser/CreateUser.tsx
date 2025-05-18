'use client'

import React from 'react'
import { toast } from 'react-toastify'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

// Password validation
const passwordValidation = new RegExp(
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
)

const addUserSchema = z.object({
  name: z.string().min(3, { message: 'Name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().regex(passwordValidation, {
    message:
      'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character',
  }),
  role: z.enum(['super-admin', 'admin'], {
    required_error: 'Role is required',
  }),
})

type AddUserForm = z.infer<typeof addUserSchema>

function CreateUser() {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddUserForm>({
    resolver: zodResolver(addUserSchema),
  })

  const onSubmit = async (data: AddUserForm) => {
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      })

      if (res.ok) {
        toast.success('User created successfully!')
        reset() // Clear form
      } else {
        const err = await res.json()
        toast.error(err.error || 'Failed to create user')
      }
    } catch (error) {
      console.error(error)
      toast.error('Something went wrong')
    }
  }

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
      <div className='flex flex-col items-center justify-center'>
        <h1 className='text-2xl font-bold text-center mt-16'>Add User</h1>
        <form onSubmit={handleSubmit(onSubmit)} className='w-[80%] space-y-6'>
          <div>
            <label htmlFor='name' className='text-sm font-medium'>
              Name
            </label>
            <Input
              id='name'
              {...register('name')}
              placeholder='Enter Your Name'
              className='border border-black bg-white w-full p-6'
            />
            {errors.name && (
              <p className='text-red-500 text-sm'>{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor='email' className='text-sm font-medium'>
              Email
            </label>
            <Input
              id='email'
              type='email'
              {...register('email')}
              placeholder='Enter email'
              className='border border-black bg-white w-full p-6'
            />
            {errors.email && (
              <p className='text-red-500 text-sm'>{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor='password' className='text-sm font-medium'>
              Password
            </label>
            <Input
              id='password'
              type='password'
              {...register('password')}
              placeholder='Enter Password'
              className='border border-black bg-white w-full p-6'
            />
            {errors.password && (
              <p className='text-red-500 text-sm'>{errors.password.message}</p>
            )}
          </div>

          <div>
            <label htmlFor='role' className='text-sm font-medium'>
              Role
            </label>
            <Select
              onValueChange={(value) =>
                setValue('role', value as 'super-admin' | 'admin')
              }
            >
              <SelectTrigger className='border border-black bg-white w-full p-6'>
                <SelectValue placeholder='Select User Role' />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Roles</SelectLabel>
                  {/* <SelectItem value='super-admin'>Super Admin</SelectItem> */}
                  <SelectItem value='admin'>Admin</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.role && (
              <p className='text-red-500 text-sm'>{errors.role.message}</p>
            )}
          </div>

          <Button
            type='submit'
            className='w-full text-md uppercase p-6 bg-[#24603a] hover:bg-[#24603a]'
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create User'}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default CreateUser
