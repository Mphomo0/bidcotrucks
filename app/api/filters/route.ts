import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const categoryId = searchParams.get('categoryId')
    const make = searchParams.get('make')
    const model = searchParams.get('model')

    const where = {
      ...(categoryId ? { categoryId } : {}),
      ...(make ? { make } : {}),
      ...(model ? { model } : {}),
    }

    const categories = await prisma.category.findMany({
      select: { id: true, name: true },
    })

    const makes = await prisma.inventory.findMany({
      where: categoryId ? { categoryId } : undefined,
      distinct: ['make'],
      select: { make: true },
    })

    const models = await prisma.inventory.findMany({
      where: {
        ...(categoryId ? { categoryId } : {}),
        ...(make ? { make } : {}),
      },
      distinct: ['model'],
      select: { model: true },
    })

    const years = await prisma.inventory.findMany({
      where: {
        ...(categoryId ? { categoryId } : {}),
        ...(make ? { make } : {}),
        ...(model ? { model } : {}),
      },
      distinct: ['year'],
      select: { year: true },
    })

    const priceRange = await prisma.inventory.aggregate({
      where,
      _min: {
        price: true,
      },
      _max: {
        price: true,
      },
    })

    return NextResponse.json({
      categories,
      makes: makes.map((m) => m.make),
      models: models.map((m) => m.model),
      years: years.map((y) => y.year),
      priceRange: {
        min: priceRange._min.price ?? 0,
        max: priceRange._max.price ?? 0,
      },
    }, { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600' } })
  } catch (error) {
    console.error('Error fetching filters:', error)
    return NextResponse.json(
      { error: 'Failed to fetch filters' },
      { status: 500 }
    )
  }
}
