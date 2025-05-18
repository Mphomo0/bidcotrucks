import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

// POST /api/category to create a new category
export const POST = auth(async function (req) {
  if (!req.auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { name } = await req.json()

  if (!name) {
    return NextResponse.json(
      { error: 'Category name is required' },
      { status: 400 }
    )
  }

  const category = await prisma.category.create({
    data: {
      name,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  })

  return NextResponse.json({ category }, { status: 201 })
})

// GET /api/category to get all categories
export const GET = async function () {
  const categories = await prisma.category.findMany()
  return NextResponse.json({ categories }, { status: 200 })
}
