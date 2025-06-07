import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import {
  Condition,
  FuelType,
  Transmission,
  Status,
} from '@/lib/generated/prisma/client'

// GET /api/vehicles/:id - Fetch a vehicle by ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id

  try {
    const vehicle = await prisma.inventory.findUnique({
      where: { id },
    })

    if (!vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
    }

    return NextResponse.json({ vehicle }, { status: 200 })
  } catch (error) {
    console.error('Error fetching vehicle:', error)
    return NextResponse.json(
      { error: 'Failed to fetch vehicle' },
      { status: 500 }
    )
  }
}

// DELETE /api/vehicles/:id - Delete a vehicle by ID
export const DELETE = auth(async (req, { params }) => {
  const id = (await params).id

  if (!req.auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const vehicle = await prisma.inventory.delete({
      where: { id },
      select: { images: true },
    })

    // Remove sensitive data if needed
    const { ...safeVehicle } = vehicle

    return NextResponse.json({ vehicle: safeVehicle }, { status: 200 })
  } catch (error) {
    console.error('Error deleting vehicle:', error)

    if (
      error instanceof Error &&
      error.message.includes('Record to delete does not exist')
    ) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
    }

    return NextResponse.json(
      { error: 'Failed to delete vehicle' },
      { status: 500 }
    )
  }
})

// PUT /api/vehicles/:id - Update a vehicle by ID
// export const PUT = auth(async (req, { params }) => {
//   const id = (await params).id

//   if (!req.auth) {
//     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
//   }

//   try {
//     const body = await req.json()

//     // Create slug based on the name or another relevant field
//     const slug = body.name
//       .toLowerCase()
//       .replace(/\s+/g, '-')
//       .replace(/[^\w-]+/g, '')

//     // Make sure categoryId exists
//     const categoryExists = await prisma.category.findUnique({
//       where: { id: body.categoryId },
//     })

//     if (!categoryExists) {
//       return NextResponse.json({ error: 'Category not found' }, { status: 400 })
//     }

//     const vehicle = await prisma.inventory.update({
//       where: { id },
//       data: {
//         name: body.name,
//         make: body.make,
//         model: body.model,
//         year: body.year,
//         price: body.price,
//         mileage: body.mileage,
//         fuelType: body.fuelType,
//         condition: body.condition,
//         transmission: body.transmission,
//         images: body.images || [], // If images are not provided, default to empty array
//         status: body.status,
//         description: body.description,
//         slug, // Use the generated slug
//         categoryId: body.categoryId,
//       },
//     })

//     return NextResponse.json({ vehicle }, { status: 200 })
//   } catch (error) {
//     console.error('Error updating vehicle:', error)

//     // Detailed error handling for Prisma validation errors
//     if (
//       error instanceof Error &&
//       error.message.includes('Record to update does not exist')
//     ) {
//       return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
//     }

//     // Return a more generic error message in case of other errors
//     return NextResponse.json(
//       { error: 'Failed to update vehicle', details: (error as Error).message },
//       { status: 500 }
//     )
//   }
// })

interface UpdateVehicleBody {
  name: string
  make: string
  model: string
  year: number
  price: number
  mileage?: number | null
  fuelType?: FuelType | null
  condition: Condition
  transmission?: Transmission | null
  images?: string[]
  status: Status
  slug: string
  description: string
  categoryId: string
}

export const PUT = auth(async (req, { params }) => {
  const id = (await params).id

  if (!req.auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body: UpdateVehicleBody = await req.json()

    // Ensure the vehicle exists first (for checking old name/slug)
    const existingVehicle = await prisma.inventory.findUnique({
      where: { id },
    })

    if (!existingVehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
    }

    // Generate new slug only if name has changed
    const slug =
      body.name !== existingVehicle.name
        ? body.name
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]+/g, '')
        : existingVehicle.slug

    // Validate category exists
    const categoryExists = await prisma.category.findUnique({
      where: { id: body.categoryId },
    })

    if (!categoryExists) {
      return NextResponse.json(
        { error: `Category not found: ${body.categoryId}` },
        { status: 400 }
      )
    }

    // Build update payload
    const updateData = {
      name: body.name,
      make: body.make,
      model: body.model,
      year: body.year,
      price: body.price,
      transmission: body.transmission,
      mileage: body.mileage,
      fuelType: body.fuelType,
      images: body.images ?? [],
      status: body.status,
      condition: body.condition,
      description: body.description,
      slug,
      category: { connect: { id: body.categoryId } },
    }

    // Include optional fields if defined
    if (body.mileage != null) {
      updateData.mileage = body.mileage
    }

    if (body.fuelType != null) {
      updateData.fuelType = body.fuelType
    }

    if (body.transmission != null) {
      updateData.transmission = body.transmission
    }

    // Perform the update
    const vehicle = await prisma.inventory.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({ vehicle }, { status: 200 })
  } catch (error) {
    console.error('Error updating vehicle:', error)

    if (
      error instanceof Error &&
      error.message.includes('Record to update does not exist')
    ) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
    }

    return NextResponse.json(
      { error: 'Failed to update vehicle', details: (error as Error).message },
      { status: 500 }
    )
  }
})
