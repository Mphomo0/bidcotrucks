'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

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
import { AppSidebar } from '@/components/sections/dashboard/AppSidebar'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'react-toastify'

export default function Profile() {
  const { data: session, status, update } = useSession()
  const router = useRouter()

  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
    if (session?.user) {
      setForm({
        name: session.user.name ?? '',
        email: session.user.email ?? '',
        password: '',
      })
    }
  }, [session, status, router])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const body = {
      name: form.name,
      email: form.email,
      ...(form.password ? { password: form.password } : {}),
    }

    const res = await fetch('/api/users/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    setLoading(false)

    if (res.ok) {
      toast.success('Profile updated!')
      await update() // Refresh session with new data
    } else {
      const data = await res.json()
      toast.error(data.error || 'Failed to update profile')
    }
  }

  if (status === 'loading')
    return (
      <p className='flex h-screen items-center justify-center'>Loading...</p>
    )
  if (!session) return null

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className='flex h-16 items-center gap-2 px-4'>
          <SidebarTrigger className='-ml-1' />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className='text-black'>
                <BreadcrumbLink href='/dashboard' className='hover:text-black'>
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className='text-black' />
              <BreadcrumbItem>
                <BreadcrumbPage className='text-black'>Profile</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <div className='p-4 pt-0'>
          <div className='min-h-[100vh] rounded-xl bg-muted/50 md:min-h-min'>
            <div className='flex flex-col items-center w-3/4 mx-auto mt-8'>
              <h1 className='text-2xl font-bold mt-16 mb-16'>All Users</h1>
              <div className='w-full md:w-3/4'>
                <form onSubmit={handleSubmit} className='space-y-4'>
                  <div>
                    <label>Name</label>
                    <Input
                      name='name'
                      value={form.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label>Email</label>
                    <Input
                      name='email'
                      value={form.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label>New Password</label>
                    <Input
                      name='password'
                      type='password'
                      value={form.password}
                      onChange={handleChange}
                    />
                  </div>
                  <Button type='submit' disabled={loading} className='mb-36'>
                    {loading ? 'Updating...' : 'Update Profile'}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
