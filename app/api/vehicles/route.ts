import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { Status } from '@/lib/generated/prisma/client'
import slugify from 'slugify'

// POST /api/vehicles to create a new vehicle
export const POST = auth(async function (req) {
  if (!req.auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()

    const {
      name,
      make,
      model,
      year,
      price,
      mileage,
      fuelType,
      condition,
      transmission,
      images,
      status,
      description,
      categoryId,
    } = body

    // Required fields (excluding optional ones)
    const requiredFields = [
      name,
      make,
      model,
      year,
      price,
      condition,
      status,
      description,
      categoryId,
    ]

    if (requiredFields.some((field) => field === undefined || field === null)) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        { error: 'At least one image is required' },
        { status: 400 }
      )
    }

    if (
      !images.every(
        (img) => typeof img.url === 'string' && typeof img.fileId === 'string'
      )
    ) {
      return NextResponse.json(
        { error: 'Each image must have a valid url and fileId' },
        { status: 400 }
      )
    }

    // Parse numeric values
    const parsedYear = parseInt(year)
    const parsedPrice = parseFloat(price)
    const parsedMileage =
      mileage !== undefined && mileage !== null ? parseFloat(mileage) : null

    if (isNaN(parsedYear) || isNaN(parsedPrice) || isNaN(parsedMileage ?? 0)) {
      return NextResponse.json(
        { error: 'Year, price, and mileage must be valid numbers' },
        { status: 400 }
      )
    }

    // Optional fields
    if (mileage && isNaN(parsedMileage ?? 0)) {
      return NextResponse.json(
        { error: 'Mileage must be a valid number' },
        { status: 400 }
      )
    }

    const upperFuelType =
      fuelType !== undefined && fuelType !== null
        ? fuelType.toUpperCase()
        : null

    const upperTransmission =
      transmission !== undefined && transmission !== null
        ? transmission.toUpperCase()
        : null

    // Normalize enum values
    const upperCondition = condition.toUpperCase()
    const upperStatus = status.toUpperCase()

    // Ensure the category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    })

    if (!category) {
      return NextResponse.json(
        { error: `Category with id '${categoryId}' not found` },
        { status: 404 }
      )
    }

    // Generate unique slug
    const baseSlug = slugify(`${make}-${model}-${year}`, { lower: true })
    let slug = baseSlug
    let counter = 1
    while (await prisma.inventory.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter++}`
    }

    // Create vehicle
    const newVehicle = await prisma.inventory.create({
      data: {
        name,
        make,
        model,
        year: parsedYear,
        price: parsedPrice,
        mileage: parsedMileage,
        fuelType: upperFuelType,
        condition: upperCondition,
        transmission: upperTransmission,
        images,
        status: upperStatus,
        description,
        slug,
        categoryId,
      },
    })

    return NextResponse.json(newVehicle, { status: 201 })
  } catch (error) {
    console.error('Vehicle creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create vehicle' },
      { status: 500 }
    )
  }
})

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url)

    const page = Number.parseInt(searchParams.get('page') || '1', 10)
    const limit = Number.parseInt(searchParams.get('limit') || '10', 10)
    const skip = (page - 1) * limit

    const categoryId = searchParams.get('category')
    const make = searchParams.get('make')
    const model = searchParams.get('model')
    const year = searchParams.get('year')
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')

    const sort = searchParams.get('sort') || 'createdAt'
    const order = searchParams.get('order') || 'desc'

    const filters: Record<string, unknown> = {}

    if (categoryId) filters.categoryId = categoryId
    if (make) filters.make = make
    if (model) filters.model = model
    if (year) filters.year = Number.parseInt(year)
    if (status) filters.status = status

    if (search) {
      filters.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { make: { contains: search, mode: 'insensitive' } },
        { model: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (minPrice || maxPrice) {
      const priceFilter: { gte?: number; lte?: number } = {}
      if (minPrice) priceFilter.gte = Number.parseFloat(minPrice)
      if (maxPrice) priceFilter.lte = Number.parseFloat(maxPrice)
      filters.price = priceFilter
    }

    const total = await prisma.inventory.count({ where: filters })

    const vehicles = await prisma.inventory.findMany({
      skip,
      take: limit,
      where: filters,
      orderBy: {
        [sort]: order,
      },
    })

    return NextResponse.json(
      {
        data: vehicles,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
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
