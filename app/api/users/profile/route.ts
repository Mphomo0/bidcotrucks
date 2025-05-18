import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { NextResponse } from 'next/server'

interface UpdateData {
  name?: string
  email?: string
  password?: string
}

export async function PATCH(req: Request) {
  try {
    const session = await auth()

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, email, password } = await req.json()
    const updateData: UpdateData = {}

    if (name) updateData.name = name

    if (email && email !== session.user.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { error: 'Invalid email format' },
          { status: 400 }
        )
      }

      const existingUser = await prisma.users.findUnique({ where: { email } })
      if (existingUser) {
        return NextResponse.json(
          { error: 'Email already in use' },
          { status: 400 }
        )
      }

      updateData.email = email
    }

    if (password && password.length > 0) {
      if (password.length < 6) {
        return NextResponse.json(
          { error: 'Password must be at least 6 characters' },
          { status: 400 }
        )
      }

      updateData.password = await hash(password, 10)
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { message: 'No changes to update' },
        { status: 200 }
      )
    }

    const updatedUser = await prisma.users.update({
      where: { email: session.user.email },
      data: updateData,
      select: { id: true, name: true, email: true },
    })

    return NextResponse.json(
      { success: true, user: updatedUser },
      { status: 200 }
    )
  } catch (error) {
    console.error('[UPDATE_PROFILE_ERROR]', error)
    return NextResponse.json(
      {
        error: 'Failed to update profile',
        details:
          process.env.NODE_ENV === 'development' ? String(error) : undefined,
      },
      { status: 500 }
    )
  }
}
