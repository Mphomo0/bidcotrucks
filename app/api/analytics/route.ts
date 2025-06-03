import { type NextRequest, NextResponse } from 'next/server'

const POSTHOG_API_URL = 'https://us.i.posthog.com/api'
const POSTHOG_API_KEY = process.env.POSTHOG_API_KEY
const POSTHOG_PROJECT_ID = process.env.POSTHOG_PROJECT_ID

interface PostHogEvent {
  event: string
  timestamp: string
  properties: {
    $current_url?: string
    $lib?: string
    $device_type?: string
    $session_duration?: number
  }
  person?: {
    distinct_id: string
  }
}

export async function GET(request: NextRequest) {
  if (!POSTHOG_API_KEY || !POSTHOG_PROJECT_ID) {
    return NextResponse.json(
      { error: 'PostHog API credentials not configured' },
      { status: 500 }
    )
  }

  const { searchParams } = new URL(request.url)
  const range = searchParams.get('range') || '7d'

  // Calculate date range
  const endDate = new Date()
  const startDate = new Date()

  switch (range) {
    case '1d':
      startDate.setDate(endDate.getDate() - 1)
      break
    case '7d':
      startDate.setDate(endDate.getDate() - 7)
      break
    case '30d':
      startDate.setDate(endDate.getDate() - 30)
      break
    case '90d':
      startDate.setDate(endDate.getDate() - 90)
      break
    default:
      startDate.setDate(endDate.getDate() - 7)
  }

  try {
    const headers = {
      Authorization: `Bearer ${POSTHOG_API_KEY}`,
      'Content-Type': 'application/json',
    }

    // Fetch events data
    const eventsResponse = await fetch(
      `${POSTHOG_API_URL}/projects/${POSTHOG_PROJECT_ID}/events/?after=${startDate.toISOString()}&before=${endDate.toISOString()}`,
      { headers }
    )

    if (!eventsResponse.ok) {
      throw new Error(`PostHog API error: ${eventsResponse.status}`)
    }

    const eventsData = await eventsResponse.json()
    const events: PostHogEvent[] = eventsData.results || []

    // Process the data
    const analytics = processAnalyticsData(events, startDate, endDate)

    return NextResponse.json(analytics)
  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    )
  }
}

function processAnalyticsData(
  events: PostHogEvent[],
  startDate: Date,
  endDate: Date
) {
  // Filter pageview events
  const pageviews = events.filter((event) => event.event === '$pageview')
  const allEvents = events.filter((event) => event.event !== '$pageview')

  // Calculate unique users
  const uniqueUsers = new Set(
    events.map((event) => event.person?.distinct_id).filter(Boolean)
  )

  // Calculate pageviews over time
  const pageviewsOverTime = generateTimeSeriesData(
    pageviews,
    startDate,
    endDate
  )

  // Calculate top pages
  const pageCount: Record<string, number> = {}
  pageviews.forEach((event) => {
    const url = event.properties.$current_url || 'Unknown'
    try {
      const path = new URL(url).pathname
      pageCount[path] = (pageCount[path] || 0) + 1
    } catch {
      pageCount[url] = (pageCount[url] || 0) + 1
    }
  })

  const topPages = Object.entries(pageCount)
    .map(([page, views]) => ({ page, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 10)

  // Calculate top events
  const eventCount: Record<string, number> = {}
  allEvents.forEach((event) => {
    eventCount[event.event] = (eventCount[event.event] || 0) + 1
  })

  const topEvents = Object.entries(eventCount)
    .map(([event, count]) => ({ event, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  // Calculate device types
  const deviceCount: Record<string, number> = {}
  events.forEach((event) => {
    const device = event.properties.$device_type || 'Unknown'
    deviceCount[device] = (deviceCount[device] || 0) + 1
  })

  const totalDeviceEvents = Object.values(deviceCount).reduce(
    (sum, count) => sum + count,
    0
  )
  const deviceTypes = Object.entries(deviceCount)
    .map(([device, count]) => ({
      device,
      count,
      percentage: totalDeviceEvents > 0 ? (count / totalDeviceEvents) * 100 : 0,
    }))
    .sort((a, b) => b.count - a.count)

  // Calculate session duration
  const sessionDurations = events
    .map((event) => event.properties.$session_duration)
    .filter(
      (duration): duration is number =>
        typeof duration === 'number' && duration > 0
    )

  const avgSessionDuration =
    sessionDurations.length > 0
      ? sessionDurations.reduce((sum, duration) => sum + duration, 0) /
        sessionDurations.length
      : 0

  // Calculate user growth (simplified - comparing first half vs second half of period)
  const midDate = new Date((startDate.getTime() + endDate.getTime()) / 2)
  const firstHalfUsers = new Set(
    events
      .filter((event) => new Date(event.timestamp) < midDate)
      .map((event) => event.person?.distinct_id)
      .filter(Boolean)
  )
  const secondHalfUsers = new Set(
    events
      .filter((event) => new Date(event.timestamp) >= midDate)
      .map((event) => event.person?.distinct_id)
      .filter(Boolean)
  )

  const userGrowth =
    firstHalfUsers.size > 0
      ? ((secondHalfUsers.size - firstHalfUsers.size) / firstHalfUsers.size) *
        100
      : 0

  // Calculate bounce rate (simplified - users with only one pageview)
  const userPageviews: Record<string, number> = {}
  pageviews.forEach((event) => {
    const userId = event.person?.distinct_id
    if (userId) {
      userPageviews[userId] = (userPageviews[userId] || 0) + 1
    }
  })

  const singlePageUsers = Object.values(userPageviews).filter(
    (count) => count === 1
  ).length
  const bounceRate =
    uniqueUsers.size > 0 ? (singlePageUsers / uniqueUsers.size) * 100 : 0

  return {
    totalUsers: uniqueUsers.size,
    totalPageviews: pageviews.length,
    totalEvents: allEvents.length,
    bounceRate,
    pageviewsOverTime,
    topPages,
    topEvents,
    deviceTypes,
    userGrowth,
    avgSessionDuration,
  }
}

function generateTimeSeriesData(
  events: PostHogEvent[],
  startDate: Date,
  endDate: Date
) {
  const data: Array<{ date: string; pageviews: number }> = []
  const current = new Date(startDate)

  while (current <= endDate) {
    const dateStr = current.toISOString().split('T')[0]
    const dayEvents = events.filter((event) => {
      const eventDate = new Date(event.timestamp).toISOString().split('T')[0]
      return eventDate === dateStr
    })

    data.push({
      date: dateStr,
      pageviews: dayEvents.length,
    })

    current.setDate(current.getDate() + 1)
  }

  return data
}
