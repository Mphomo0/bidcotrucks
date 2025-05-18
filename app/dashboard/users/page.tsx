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

interface User {
  id: string
  name: string
  email: string
  password: string
  role: 'super-admin' | 'admin'
}

export default function UserPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [formUser, setFormUser] = useState<Partial<User> | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [showPassword, setShowPassword] = useState(false) // State for password visibility toggle

  const { data: session, status } = useSession()
  const router = useRouter()

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users')
      if (!res.ok) throw new Error('Failed to fetch users')
      const data = await res.json()
      const usersData = Array.isArray(data) ? data : []
      setUsers(usersData)
    } catch (error) {
      console.error(error)
      toast.error('Error loading users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // If the user is not authenticated, redirect to login
    if (status === 'unauthenticated') {
      router.push('/login')
    }
    fetchUsers()
  }, [status, router])

  // Show loading state while checking authentication
  if (status === 'loading') {
    return (
      <div className='flex h-screen items-center justify-center'>
        Loading...
      </div>
    )
  }

  // Only render the dashboard if authenticated
  if (!session) {
    return null
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return
    try {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete user')
      toast.success('User deleted')
      fetchUsers()
    } catch (error) {
      console.error(error)
      toast.error('Error deleting user')
    }
  }

  const handleEdit = (user: User) => {
    setFormUser(user)
    setIsEditing(true)
    setShowForm(true)
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formUser?.name || !formUser?.email || !formUser?.role) {
      toast.error('Please fill out all fields')
      return
    }

    try {
      const res = await fetch(
        isEditing ? `/api/users/${formUser.id}` : '/api/users',
        {
          method: isEditing ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formUser),
        }
      )
      if (!res.ok) throw new Error('Failed to save user')
      toast.success(`User ${isEditing ? 'updated' : 'added'}`)
      setShowForm(false)
      fetchUsers()
    } catch (error) {
      console.error(error)
      toast.error('Error saving user')
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
                  <BreadcrumbLink href='#'>Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className='hidden md:block' />
                <BreadcrumbItem>
                  <BreadcrumbPage>Users</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className='p-4 pt-0'>
          <div className='min-h-auto flex-1 rounded-xl bg-muted/50 px-4 top-8'>
            <div className='flex justify-between items-center w-3/4 mx-auto mt-8'>
              <h1 className='text-2xl font-bold mt-16 mb-16'>All Users</h1>
              <Link
                href={'/dashboard/users/adduser'}
                className='px-4 py-2 bg-[#24603a] font-semibold text-white rounded bg-[#24603a]'
              >
                Add User
              </Link>
            </div>

            {loading ? (
              <p className='flex justify-center items-center h-full'>
                Loading...
              </p>
            ) : (
              <Table className='w-3/4 mx-auto py-6 mb-16'>
                <TableCaption>A list of all registered users.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users?.map((user: User) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.id}</TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell className='space-x-2 text-center'>
                        {session?.user?.role === 'super-admin' && (
                          <>
                            <button
                              className='text-blue-600 hover:underline'
                              onClick={() => handleEdit(user)}
                            >
                              Edit
                            </button>
                            <button
                              className='text-red-600 hover:underline'
                              onClick={() => handleDelete(user.id)}
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {showForm && (
              <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
                <div className='bg-white rounded-lg p-6 w-[400px] shadow-lg'>
                  <h2 className='text-lg font-semibold mb-4'>
                    {isEditing ? 'Edit User' : 'Add User'}
                  </h2>
                  <form onSubmit={handleFormSubmit} className='space-y-4'>
                    <input
                      type='text'
                      placeholder='Name'
                      value={formUser?.name || ''}
                      onChange={(e) =>
                        setFormUser({ ...formUser!, name: e.target.value })
                      }
                      className='w-full p-2 border rounded'
                    />
                    <input
                      type='email'
                      placeholder='Email'
                      value={formUser?.email || ''}
                      onChange={(e) =>
                        setFormUser({ ...formUser!, email: e.target.value })
                      }
                      className='w-full p-2 border rounded'
                    />
                    <div className='relative'>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder='Password'
                        value={formUser?.password || ''}
                        onChange={(e) =>
                          setFormUser({
                            ...formUser!,
                            password: e.target.value,
                          })
                        }
                        className='w-full p-2 border rounded'
                      />
                      <button
                        type='button'
                        onClick={() => setShowPassword(!showPassword)}
                        className='absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-gray-500'
                      >
                        {showPassword ? 'Hide' : 'Show'}
                      </button>
                    </div>
                    <select
                      value={formUser?.role || 'admin'}
                      onChange={(e) =>
                        setFormUser({
                          ...formUser!,
                          role: e.target.value as User['role'],
                        })
                      }
                      className='w-full p-2 border rounded'
                    >
                      <option value='admin'>Admin</option>
                      <option value='super-admin'>Super Admin</option>
                    </select>

                    <div className='flex justify-end space-x-2'>
                      <button
                        type='button'
                        onClick={() => setShowForm(false)}
                        className='px-4 py-2 border rounded'
                      >
                        Cancel
                      </button>
                      <button
                        type='submit'
                        className='px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700'
                      >
                        Save
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
