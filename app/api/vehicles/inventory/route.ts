import { NextResponse, type NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

interface PriceFilter {
  gte?: number
  lte?: number
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    // Parse pagination parameters
    const page = Number.parseInt(searchParams.get('page') || '1', 10)
    const limit = Number.parseInt(searchParams.get('limit') || '10', 10)
    const skip = (page - 1) * limit

    // Parse filter parameters
    const categoryId = searchParams.get('category')
    const make = searchParams.get('make')
    const model = searchParams.get('model')
    const year = searchParams.get('year')
    const search = searchParams.get('search')

    // Parse price range parameters
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')

    // Parse sort parameters
    const sortParam = searchParams.get('sort') || 'createdAt:desc'
    const [sortFieldRaw, sortOrderRaw] = sortParam.split(':')
    const allowedSortFields = ['createdAt', 'price', 'year', 'name']
    const sortField = allowedSortFields.includes(sortFieldRaw)
      ? sortFieldRaw
      : 'createdAt'
    const sortOrder = ['asc', 'desc'].includes(sortOrderRaw?.toLowerCase())
      ? sortOrderRaw.toLowerCase()
      : 'desc'

    // Build where clause for filtering
    const where: Record<string, unknown> = {}

    if (categoryId && categoryId !== 'all') {
      where.categoryId = categoryId
    }

    if (make && make !== 'all') {
      where.make = make
    }

    if (model && model !== 'all') {
      where.model = model
    }

    const yearNumber = Number.parseInt(year || '')
    if (!isNaN(yearNumber)) {
      where.year = yearNumber
    }

    if (minPrice || maxPrice) {
      const priceFilter: PriceFilter = {}
      if (minPrice) priceFilter.gte = parseFloat(minPrice)
      if (maxPrice) priceFilter.lte = parseFloat(maxPrice)
      where.price = priceFilter
    }

    if (search) {
      where.AND = [
        {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { make: { contains: search, mode: 'insensitive' } },
            { model: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ],
        },
      ]
    }

    // Calculate price range for current filter set
    // const priceStats = await prisma.inventory.aggregate({
    //   where,
    //   _min: { price: true },
    //   _max: { price: true },
    // })

    // const priceRange = {
    //   min: priceStats._min.price ?? 0,
    //   max: priceStats._max.price ?? 1000000,
    // }

    // Count total matching items for pagination
    const total = await prisma.inventory.count({ where })

    // Fetch the filtered and sorted items
    const vehicles = await prisma.inventory.findMany({
      skip,
      take: limit,
      where,
      orderBy: {
        [sortField]: sortOrder,
      },
    })

    // Get available makes based on applied category filter
    const makeFilter: Record<string, unknown> = {}
    if (categoryId && categoryId !== 'all') {
      makeFilter.categoryId = categoryId
    }

    const availableMakes = await prisma.inventory.groupBy({
      by: ['make'],
      where: makeFilter,
      orderBy: {
        make: 'asc',
      },
    })

    // Get available models based on applied category and make filters
    const modelFilter: Record<string, unknown> = {}
    if (categoryId && categoryId !== 'all') {
      modelFilter.categoryId = categoryId
    }
    if (make && make !== 'all') {
      modelFilter.make = make
    }

    const availableModels = await prisma.inventory.groupBy({
      by: ['model'],
      where: modelFilter,
      orderBy: {
        model: 'asc',
      },
    })

    // Get available years based on current filters
    const yearFilter: Record<string, unknown> = {}
    if (categoryId && categoryId !== 'all') {
      yearFilter.categoryId = categoryId
    }
    if (make && make !== 'all') {
      yearFilter.make = make
    }
    if (model && model !== 'all') {
      yearFilter.model = model
    }

    const availableYears = await prisma.inventory.groupBy({
      by: ['year'],
      where: yearFilter,
      orderBy: {
        year: 'desc',
      },
    })

    // Calculate filtered price range
    const filteredPriceStats = await prisma.inventory.aggregate({
      where: yearFilter,
      _min: { price: true },
      _max: { price: true },
    })

    const filteredPriceRange = {
      min: filteredPriceStats._min.price ?? 0,
      max: filteredPriceStats._max.price ?? 1000000,
    }

    return NextResponse.json(
      {
        data: vehicles,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
        priceRange: filteredPriceRange,
        filters: {
          makes: availableMakes.map((item) => item.make),
          models: availableModels.map((item) => item.model),
          years: availableYears.map((item) => item.year),
        },
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600',
        },
      }
    )
  } catch (error) {
    console.error('Vehicle fetch error:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch vehicles',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
