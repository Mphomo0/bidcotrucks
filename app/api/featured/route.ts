import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const ids = await prisma.inventory.findMany({ select: { id: true } })

    const numToFetch = Math.min(6, ids.length)
    const shuffled = [...ids].sort(() => Math.random() - 0.5)
    const pickedIds = shuffled.slice(0, numToFetch).map((v) => v.id)

    const randomVehicles = await prisma.inventory.findMany({
      where: { id: { in: pickedIds } },
      include: { category: true },
    })

    return NextResponse.json(randomVehicles, {
      status: 200,
      headers: {
        // CDN caches the response; the random pick rotates on revalidation
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600',
      },
    })
  } catch (error) {
    console.error('Random vehicle fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch random vehicles' },
      { status: 500 }
    )
  }
}
