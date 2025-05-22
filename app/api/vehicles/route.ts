import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import slugify from 'slugify'

// interface Filters {
//   categoryId?: string
//   make?: string
//   model?: string
//   year?: number
// }

interface Filters {
  categoryId?: string
  make?: string
  model?: string
  year?: number
  price?: {
    gte?: number
    lte?: number
  }
}

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

    // Validate required fields
    const requiredFields = [
      name,
      make,
      model,
      year,
      price,
      mileage,
      fuelType,
      condition,
      transmission,
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
    const parsedMileage = parseFloat(mileage)

    if (isNaN(parsedYear) || isNaN(parsedPrice) || isNaN(parsedMileage)) {
      return NextResponse.json(
        { error: 'Year, price, and mileage must be valid numbers' },
        { status: 400 }
      )
    }

    // Normalize enum values
    const upperFuelType = fuelType.toUpperCase()
    const upperCondition = condition.toUpperCase()
    const upperTransmission = transmission.toUpperCase()
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

// export const GET = async (req: NextRequest) => {
//   try {
//     // Get the search parameters from the request URL
//     const { searchParams } = new URL(req.url)

//     // Parse 'page' and 'limit' query parameters, with default values
//     const page = Number.parseInt(searchParams.get('page') || '1', 10)
//     const limit = Number.parseInt(searchParams.get('limit') || '10', 10)

//     // Calculate how many items to skip
//     const skip = (page - 1) * limit

//     // Extract and prepare filters
//     const categoryId = searchParams.get('category')
//     const make = searchParams.get('make')
//     const model = searchParams.get('model')
//     const year = searchParams.get('year')

//     const filters: Filters = {}

//     if (categoryId) filters.categoryId = categoryId
//     if (make) filters.make = make
//     if (model) filters.model = model
//     if (year) filters.year = parseInt(year)

//     // First, let's check if the inventory table exists and has the expected structure
//     // by just getting the count without any complex queries
//     const total = await prisma.inventory.count()

//     // Now let's fetch the data with a simpler query first
//     const vehicles = await prisma.inventory.findMany({
//       skip,
//       take: limit,
//       where: filters,
//     })

//     // Return the paginated response with metadata
//     return NextResponse.json(
//       {
//         data: vehicles,
//         meta: {
//           total,
//           page,
//           limit,
//           totalPages: Math.ceil(total / limit),
//         },
//       },
//       { status: 200 }
//     )
//   } catch (error) {
//     console.error('Vehicle fetch error:', error)
//     // Return more detailed error information to help with debugging
//     return NextResponse.json(
//       {
//         error: 'Failed to fetch vehicles',
//         details: error instanceof Error ? error.message : String(error),
//       },
//       { status: 500 }
//     )
//   }
// }

// export const GET = async (req: NextRequest) => {
//   try {
//     const { searchParams } = new URL(req.url)

//     const page = Number.parseInt(searchParams.get('page') || '1', 10)
//     const limit = Number.parseInt(searchParams.get('limit') || '10', 10)
//     const skip = (page - 1) * limit

//     const categoryId = searchParams.get('category')
//     const make = searchParams.get('make')
//     const model = searchParams.get('model')
//     const year = searchParams.get('year')

//     const minPrice = searchParams.get('minPrice')
//     const maxPrice = searchParams.get('maxPrice')

//     const filters: Filters = {}

//     if (categoryId) filters.categoryId = categoryId
//     if (make) filters.make = make
//     if (model) filters.model = model
//     if (year) filters.year = parseInt(year)

//     if (minPrice || maxPrice) {
//       filters.price = {}
//       if (minPrice) filters.price.gte = parseFloat(minPrice)
//       if (maxPrice) filters.price.lte = parseFloat(maxPrice)
//     }

//     const total = await prisma.inventory.count({ where: filters })

//     const vehicles = await prisma.inventory.findMany({
//       skip,
//       take: limit,
//       where: filters,
//     })

//     return NextResponse.json(
//       {
//         data: vehicles,
//         meta: {
//           total,
//           page,
//           limit,
//           totalPages: Math.ceil(total / limit),
//         },
//       },
//       { status: 200 }
//     )
//   } catch (error) {
//     console.error('Vehicle fetch error:', error)
//     return NextResponse.json(
//       {
//         error: 'Failed to fetch vehicles',
//         details: error instanceof Error ? error.message : String(error),
//       },
//       { status: 500 }
//     )
//   }
// }

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

    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')

    const sort = searchParams.get('sort') || 'createdAt'
    const order = searchParams.get('order') || 'desc'

    const filters: Filters = {}

    if (categoryId) filters.categoryId = categoryId
    if (make) filters.make = make
    if (model) filters.model = model
    if (year) filters.year = Number.parseInt(year)

    if (minPrice || maxPrice) {
      filters.price = {}
      if (minPrice) filters.price.gte = Number.parseFloat(minPrice)
      if (maxPrice) filters.price.lte = Number.parseFloat(maxPrice)
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
