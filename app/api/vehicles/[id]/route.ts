import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

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
export const PUT = auth(async (req, { params }) => {
  const id = (await params).id

  if (!req.auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()

    // Create slug based on the name or another relevant field
    const slug = body.name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')

    // Make sure categoryId exists
    const categoryExists = await prisma.category.findUnique({
      where: { id: body.categoryId },
    })

    if (!categoryExists) {
      return NextResponse.json({ error: 'Category not found' }, { status: 400 })
    }

    const vehicle = await prisma.inventory.update({
      where: { id },
      data: {
        name: body.name,
        make: body.make,
        model: body.model,
        year: body.year,
        price: body.price,
        mileage: body.mileage,
        fuelType: body.fuelType,
        condition: body.condition,
        transmission: body.transmission,
        images: body.images || [], // If images are not provided, default to empty array
        status: body.status,
        description: body.description,
        slug, // Use the generated slug
        categoryId: body.categoryId,
      },
    })

    return NextResponse.json({ vehicle }, { status: 200 })
  } catch (error) {
    console.error('Error updating vehicle:', error)

    // Detailed error handling for Prisma validation errors
    if (
      error instanceof Error &&
      error.message.includes('Record to update does not exist')
    ) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
    }

    // Return a more generic error message in case of other errors
    return NextResponse.json(
      { error: 'Failed to update vehicle', details: (error as Error).message },
      { status: 500 }
    )
  }
})
