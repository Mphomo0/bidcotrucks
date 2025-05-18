import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

// Handles GET /api/filters?categoryId=...&make=...&model=...
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const categoryId = searchParams.get('categoryId')
    const make = searchParams.get('make')
    const model = searchParams.get('model')

    // Always return full categories list
    const categories = await prisma.category.findMany()

    // Start building filter conditions
    const baseWhere: Record<string, string> = {}
    if (categoryId) baseWhere.categoryId = categoryId
    if (make) baseWhere.make = make
    if (model) baseWhere.model = model

    // Makes for selected category
    const makes = await prisma.inventory.findMany({
      where: categoryId ? { categoryId } : undefined,
      distinct: ['make'],
      select: { make: true },
    })

    // Models for selected category + make
    const models = await prisma.inventory.findMany({
      where: {
        ...(categoryId ? { categoryId } : {}),
        ...(make ? { make } : {}),
      },
      distinct: ['model'],
      select: { model: true },
    })

    // Years for selected category + make + model
    const years = await prisma.inventory.findMany({
      where: {
        ...(categoryId ? { categoryId } : {}),
        ...(make ? { make } : {}),
        ...(model ? { model } : {}),
      },
      distinct: ['year'],
      select: { year: true },
    })

    return NextResponse.json({
      categories,
      makes: makes.map((m) => m.make),
      models: models.map((m) => m.model),
      years: years.map((y) => y.year),
    })
  } catch (error) {
    console.error('Error fetching filters:', error)
    return NextResponse.json(
      { error: 'Failed to fetch filters' },
      { status: 500 }
    )
  }
}
