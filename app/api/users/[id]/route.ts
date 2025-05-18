import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { auth } from '@/auth'

// GET /api/users/:id - Fetch a user by ID
export const GET = auth(async (req, { params }) => {
  const id = (await params).id

  if (!req.auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const user = await prisma.users.findUnique({
      where: { id },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Remove sensitive data
    const { ...safeUser } = user

    return NextResponse.json({ user: safeUser }, { status: 200 })
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 })
  }
})

// PUT /api/users/:id - Update a user by ID
export const PUT = auth(async (req, { params }) => {
  const id = (await params).id

  if (!req.auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { name, email, password, role } = await req.json()

    // Validate inputs
    if (!name || !email || !role) {
      return NextResponse.json(
        { error: 'Name, email, and role are required.' },
        { status: 400 }
      )
    }

    // Hash the password if it's provided
    const hashedPassword = password
      ? await bcrypt.hash(password, 10)
      : undefined

    // Update the user in the database
    const user = await prisma.users.update({
      where: { id },
      data: {
        name,
        email,
        ...(hashedPassword && { password: hashedPassword }), // Only update password if provided
        role,
      },
    })

    // Remove sensitive data
    const { ...safeUser } = user

    return NextResponse.json({ user: safeUser }, { status: 200 })
  } catch (error) {
    console.error('Error updating user:', error)

    // Check for Prisma's "record not found" error
    if (
      error instanceof Error &&
      error.message.includes('Record to update not found')
    ) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    )
  }
})

// DELETE /api/users/:id - Delete a user by ID
export const DELETE = auth(async (req, { params }) => {
  const id = (await params).id

  if (!req.auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const user = await prisma.users.delete({
      where: { id },
    })

    // Remove sensitive data
    const { ...safeUser } = user

    return NextResponse.json({ user: safeUser }, { status: 200 })
  } catch (error) {
    console.error('Error deleting user:', error)

    // Check for Prisma's "record not found" error
    if (
      error instanceof Error &&
      error.message.includes('Record to delete does not exist')
    ) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    )
  }
})
