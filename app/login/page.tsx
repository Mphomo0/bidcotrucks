'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { signIn } from 'next-auth/react'

import PageWrapper from '@/components/ui/layout/PageWrapper'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

//Define Zod schema
const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
})

// Infer TypeScript type from schema
type LoginFormInputs = z.infer<typeof loginSchema>

export default function Login() {
  const router = useRouter()

  //  Initialize useForm with zodResolver
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  })

  //  Handle form submission
  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const result = await signIn('credentials', {
        ...data,
        redirect: false,
      })

      if (result.ok) {
        toast.success('Successfully signed in!')
        router.push('/dashboard')
      } else {
        toast.error('Invalid credentials')
      }
    } catch (error) {
      console.error(error)
      toast.error('Something went wrong. Please try again.')
    }
  }

  return (
    <>
      <PageWrapper
        heading='Welcome To Our Company'
        title='Log In Form'
        link={{ href: '/login', text: 'Log In' }}
      />

      <div className='flex items-center justify-center w-full px-4 py-6 sm:py-12'>
        <div className='w-full max-w-sm sm:max-w-md mx-auto'>
          <div className='space-y-6 my-16'>
            <div className='space-y-2 text-center'>
              <h1 className='text-xl font-bold tracking-tight text-primary sm:text-2xl md:text-3xl'>
                Log In To Your Account
              </h1>
              <p className='text-sm text-muted-foreground md:text-base'>
                Enter your credentials to access your account
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className='space-y-4 sm:space-y-6'
              action={async () => {
                await signIn()
              }}
            >
              <div className='space-y-2'>
                <label htmlFor='email' className='text-sm font-medium'>
                  Email
                </label>
                <Input
                  id='email'
                  type='email'
                  placeholder='Enter email'
                  {...register('email')}
                  className='w-full p-6'
                />
                {errors.email && (
                  <p className='text-red-500 text-sm mt-1'>
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className='space-y-2'>
                <label htmlFor='password' className='text-sm font-medium'>
                  Password
                </label>
                <Input
                  id='password'
                  type='password'
                  placeholder='Enter password'
                  {...register('password')}
                  className='w-full p-6'
                />
                {errors.password && (
                  <p className='text-red-500 text-sm mt-1'>
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button
                type='submit'
                className='w-full text-md uppercase p-6 bg-[#24603a] hover:bg-[#24603a]'
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
