import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

// GET /api/category/:id to get a category by id
export const GET = auth(async (req, { params }) => {
  if (!req.auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const id = await params

  const category = await prisma.category.findUnique({ where: { id } })
  if (!category) {
    return NextResponse.json({ error: 'Category not found' }, { status: 404 })
  }
  return NextResponse.json({ category }, { status: 200 })
})

// DELETE /api/category/:id to delete a category by id
export const DELETE = auth(async (req, { params }) => {
  if (!req.auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const id = (await params).id

  try {
    const deleted = await prisma.category.delete({ where: { id } })
    return NextResponse.json({ category: deleted }, { status: 200 })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json({ error: 'Category not found' }, { status: 404 })
  }
})

// PUT /api/category/:id to update a category by id
export const PUT = auth(async (req, { params }) => {
  if (!req.auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const id = (await params).id
  const { name } = await req.json()

  try {
    const category = await prisma.category.update({
      where: { id },
      data: { name },
    })

    return NextResponse.json({ category }, { status: 200 })
  } catch (error) {
    console.error('Error updating category:', error)
    return NextResponse.json(
      { error: 'Category not found or update failed' },
      { status: 404 }
    )
  }
})
