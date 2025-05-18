'use client'

import { signIn } from '@/auth'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json()
  const { email, password } = body

  const result = await signIn('credentials', {
    email,
    password,
    redirect: false,
  })

  if (result?.ok) {
    return NextResponse.json({ ok: true })
  } else {
    return NextResponse.json({ ok: false }, { status: 401 })
  }
}
