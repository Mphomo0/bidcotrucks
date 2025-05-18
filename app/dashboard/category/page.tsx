'use client'

import { useEffect, useState } from 'react'
import { AppSidebar } from '@/components/sections/dashboard/AppSidebar'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
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

interface Category {
  id: string
  name: string
}

export default function Category() {
  const [categories, setCategories] = useState<Category[]>([])
  const [newCategory, setNewCategory] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')

  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated') {
      fetchCategories()
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className='flex h-screen items-center justify-center'>
        Loading...
      </div>
    )
  }

  if (!session) {
    return null
  }

  async function fetchCategories() {
    try {
      const res = await fetch('/api/category')
      if (!res.ok) throw new Error('Failed to fetch categories')
      const data = await res.json()
      setCategories(data.categories || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  async function handleAddCategory() {
    if (!newCategory.trim()) return

    try {
      const res = await fetch('/api/category', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategory }),
      })

      if (res.ok) {
        setNewCategory('')
        fetchCategories()
      }
    } catch (error) {
      console.error('Error adding category:', error)
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/category/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete user')
      toast.success('Category deleted')
      fetchCategories()
    } catch (error) {
      console.error('Error deleting category:', error)
      toast.error('Error deleting category')
    }
  }

  async function handleEditSave(id: string) {
    if (!editName.trim()) return

    try {
      const res = await fetch(`/api/category/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName.trim() }),
      })

      if (res.ok) {
        setEditingId(null)
        setEditName('')
        fetchCategories()
      }
    } catch (error) {
      console.error('Error updating category:', error)
    }
  }

  function handleEditStart(category: Category) {
    setEditingId(category.id)
    setEditName(category.name)
  }

  function handleCancelEdit() {
    setEditingId(null)
    setEditName('')
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className='flex h-16 items-center gap-2'>
          <div className='flex items-center gap-2 px-4'>
            <SidebarTrigger className='-ml-1' />
            <Separator orientation='vertical' className='mr-2 h-4' />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className='hidden md:block'>
                  <BreadcrumbLink href='#'>Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className='hidden md:block' />
                <BreadcrumbItem>
                  <BreadcrumbPage>Categories</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className='p-4 pt-0'>
          <div className='min-h-[100vh] flex-1 rounded-xl bg-muted/50 px-4 pt-8'>
            <div className='flex justify-between items-center mb-4'>
              <h1 className='text-2xl font-bold'>All Categories</h1>
              <div className='flex gap-2'>
                <input
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder='Category name'
                  className='px-3 py-2 border rounded-md'
                />
                <button
                  onClick={handleAddCategory}
                  className='bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90'
                >
                  + Add Category
                </button>
              </div>
            </div>

            <Table className='w-3/4 mx-auto py-6'>
              <TableCaption>A list of your inventory categories.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-[100px]'>ID</TableHead>
                  <TableHead className='w-[100px]'>Name</TableHead>
                  <TableHead className='w-[100px]'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className='py-3'>{category.id}</TableCell>
                    <TableCell className='py-3'>
                      {editingId === category.id ? (
                        <input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className='border px-2 py-1 rounded'
                        />
                      ) : (
                        category.name
                      )}
                    </TableCell>
                    <TableCell className='text-center py-3'>
                      {editingId === category.id ? (
                        <>
                          <button
                            className='text-green-600 hover:underline mr-2'
                            onClick={() => handleEditSave(category.id)}
                          >
                            Save
                          </button>
                          <button
                            className='text-gray-600 hover:underline'
                            onClick={handleCancelEdit}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className='text-blue-600 hover:underline mr-2'
                            onClick={() => handleEditStart(category)}
                          >
                            Edit
                          </button>
                          <button
                            className='text-red-600 hover:underline'
                            onClick={() => handleDelete(category.id)}
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
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
