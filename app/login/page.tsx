import React from 'react'
import PageWrapper from '@/components/ui/layout/PageWrapper'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function Login() {
  return (
    <>
      <PageWrapper
        heading='Welcome To Our Company'
        title='Log In Form'
        link={{ href: '/login', text: 'Log In' }}
      ></PageWrapper>

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

            <form className='space-y-4 sm:space-y-6'>
              <div className='space-y-2'>
                <label htmlFor='email' className='text-sm font-medium'>
                  Email
                </label>
                <Input
                  id='email'
                  type='email'
                  placeholder='Enter email'
                  required
                  className='w-full p-6'
                />
              </div>

              <div className='space-y-2'>
                <div className='flex items-center justify-between'>
                  <label htmlFor='password' className='text-sm font-medium'>
                    Password
                  </label>
                </div>
                <Input
                  id='password'
                  type='password'
                  placeholder='Enter password'
                  required
                  className='w-full p-6'
                />
              </div>

              <Button
                type='submit'
                className='w-full text-md uppercase p-6 bg-[#24603a] hover:bg-[#24603a]'
              >
                Sign in
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
