'use client'

import { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import {
  Users,
  Eye,
  MousePointer,
  TrendingUp,
  RefreshCw,
  Calendar,
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface AnalyticsData {
  totalUsers: number
  totalPageviews: number
  totalEvents: number
  bounceRate: number
  pageviewsOverTime: Array<{ date: string; pageviews: number }>
  topPages: Array<{ page: string; views: number }>
  topEvents: Array<{ event: string; count: number }>
  deviceTypes: Array<{ device: string; count: number; percentage: number }>
  userGrowth: number
  avgSessionDuration: number
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState('7d')

  const fetchAnalytics = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/analytics?range=${dateRange}`)
      if (!response.ok) {
        throw new Error('Failed to fetch analytics data')
      }
      const analyticsData = await response.json()
      setData(analyticsData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [dateRange])

  if (loading) {
    return (
      <div className='space-y-6'>
        {/* Loading state with your existing card structure */}
        <div className='grid auto-rows-min gap-4 md:grid-cols-3'>
          <div className='aspect-video rounded-xl bg-muted/50 flex flex-col justify-center items-center p-4'>
            <div className='animate-pulse space-y-2'>
              <div className='h-4 bg-muted rounded w-20'></div>
              <div className='h-8 bg-muted rounded w-16'></div>
              <div className='h-3 bg-muted rounded w-24'></div>
            </div>
          </div>
          <div className='aspect-video rounded-xl bg-muted/50 flex flex-col justify-center items-center p-4'>
            <div className='animate-pulse space-y-2'>
              <div className='h-4 bg-muted rounded w-20'></div>
              <div className='h-8 bg-muted rounded w-16'></div>
              <div className='h-3 bg-muted rounded w-24'></div>
            </div>
          </div>
          <div className='aspect-video rounded-xl bg-muted/50 flex flex-col justify-center items-center p-4'>
            <div className='animate-pulse space-y-2'>
              <div className='h-4 bg-muted rounded w-20'></div>
              <div className='h-8 bg-muted rounded w-16'></div>
              <div className='h-3 bg-muted rounded w-24'></div>
            </div>
          </div>
        </div>
        <div className='min-h-[400px] flex-1 rounded-xl bg-muted/50 flex items-center justify-center'>
          <RefreshCw className='h-8 w-8 animate-spin' />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='space-y-6'>
        <div className='grid auto-rows-min gap-4 md:grid-cols-3'>
          <div className='aspect-video rounded-xl bg-muted/50 flex flex-col justify-center items-center p-4'>
            <h2 className='text-lg font-semibold'>Users</h2>
            <p className='text-2xl font-bold'>--</p>
            <span className='text-sm text-muted-foreground'>Loading...</span>
          </div>
          <div className='aspect-video rounded-xl bg-muted/50 flex flex-col justify-center items-center p-4'>
            <h2 className='text-lg font-semibold'>Page Views</h2>
            <p className='text-2xl font-bold'>--</p>
            <span className='text-sm text-muted-foreground'>Loading...</span>
          </div>
          <div className='aspect-video rounded-xl bg-muted/50 flex flex-col justify-center items-center p-4'>
            <h2 className='text-lg font-semibold'>Events</h2>
            <p className='text-2xl font-bold'>--</p>
            <span className='text-sm text-muted-foreground'>Loading...</span>
          </div>
        </div>
        <Card className='min-h-[400px]'>
          <CardContent className='flex flex-col items-center justify-center h-full'>
            <p className='text-destructive mb-4'>Error: {error}</p>
            <Button onClick={fetchAnalytics}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className='space-y-6'>
      {/* Controls */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <Calendar className='h-4 w-4' />
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className='w-32'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='1d'>Last 24h</SelectItem>
              <SelectItem value='7d'>Last 7 days</SelectItem>
              <SelectItem value='30d'>Last 30 days</SelectItem>
              <SelectItem value='90d'>Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={fetchAnalytics} variant='outline' size='sm'>
          <RefreshCw className='h-4 w-4 mr-2' />
          Refresh
        </Button>
      </div>

      {/* Key Metrics - Using your existing card style */}
      <div className='grid auto-rows-min gap-4 md:grid-cols-3'>
        <div className='aspect-video rounded-xl bg-muted/50 flex flex-col justify-center items-center p-4'>
          <div className='flex items-center gap-2 mb-2'>
            <Users className='h-5 w-5 text-blue-600' />
            <h2 className='text-lg font-semibold'>Total Users</h2>
          </div>
          <p className='text-2xl font-bold'>
            {data.totalUsers.toLocaleString()}
          </p>
          <span
            className={`text-sm flex items-center gap-1 ${
              data.userGrowth >= 0 ? 'text-green-600' : 'text-red-600'
            }`}
          >
            <TrendingUp className='h-3 w-3' />
            {data.userGrowth >= 0 ? '+' : ''}
            {data.userGrowth.toFixed(1)}% from last period
          </span>
        </div>

        <div className='aspect-video rounded-xl bg-muted/50 flex flex-col justify-center items-center p-4'>
          <div className='flex items-center gap-2 mb-2'>
            <Eye className='h-5 w-5 text-green-600' />
            <h2 className='text-lg font-semibold'>Page Views</h2>
          </div>
          <p className='text-2xl font-bold'>
            {data.totalPageviews.toLocaleString()}
          </p>
          <span className='text-sm text-muted-foreground'>
            Total page views
          </span>
        </div>

        <div className='aspect-video rounded-xl bg-muted/50 flex flex-col justify-center items-center p-4'>
          <div className='flex items-center gap-2 mb-2'>
            <MousePointer className='h-5 w-5 text-purple-600' />
            <h2 className='text-lg font-semibold'>Events</h2>
          </div>
          <p className='text-2xl font-bold'>
            {data.totalEvents.toLocaleString()}
          </p>
          <span className='text-sm text-muted-foreground'>
            Total events tracked
          </span>
        </div>
      </div>

      {/* Charts Section */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Page Views Over Time */}
        <Card>
          <CardHeader>
            <CardTitle>Page Views Over Time</CardTitle>
            <CardDescription>Daily page view trends</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={300}>
              <LineChart data={data.pageviewsOverTime}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis
                  dataKey='date'
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) =>
                    new Date(value).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })
                  }
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString()
                  }
                  formatter={(value: number) => [
                    value.toLocaleString(),
                    'Page Views',
                  ]}
                />
                <Line
                  type='monotone'
                  dataKey='pageviews'
                  stroke='#8884d8'
                  strokeWidth={2}
                  dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Device Types */}
        <Card>
          <CardHeader>
            <CardTitle>Device Types</CardTitle>
            <CardDescription>User device distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={300}>
              <PieChart>
                <Pie
                  data={data.deviceTypes}
                  cx='50%'
                  cy='50%'
                  labelLine={false}
                  label={({ device, percentage }) =>
                    `${device} ${percentage.toFixed(1)}%`
                  }
                  outerRadius={80}
                  fill='#8884d8'
                  dataKey='count'
                >
                  {data.deviceTypes.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [
                    value.toLocaleString(),
                    'Users',
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Pages and Events */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Top Pages */}
        <Card>
          <CardHeader>
            <CardTitle>Top Pages</CardTitle>
            <CardDescription>Most visited pages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {data.topPages.slice(0, 5).map((page, index) => (
                <div
                  key={page.page}
                  className='flex items-center justify-between'
                >
                  <div className='flex items-center gap-3'>
                    <Badge
                      variant='outline'
                      className='w-6 h-6 p-0 flex items-center justify-center'
                    >
                      {index + 1}
                    </Badge>
                    <span className='font-medium truncate'>{page.page}</span>
                  </div>
                  <span className='text-sm text-muted-foreground'>
                    {page.views.toLocaleString()} views
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Events */}
        <Card>
          <CardHeader>
            <CardTitle>Top Events</CardTitle>
            <CardDescription>Most triggered events</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={200}>
              <BarChart data={data.topEvents.slice(0, 5)} layout='horizontal'>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis type='number' tick={{ fontSize: 12 }} />
                <YAxis
                  type='category'
                  dataKey='event'
                  tick={{ fontSize: 12 }}
                  width={100}
                />
                <Tooltip
                  formatter={(value: number) => [
                    value.toLocaleString(),
                    'Count',
                  ]}
                />
                <Bar dataKey='count' fill='#8884d8' />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <Card>
          <CardHeader>
            <CardTitle>Session Insights</CardTitle>
            <CardDescription>User engagement metrics</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex items-center justify-between'>
              <span className='text-sm font-medium'>
                Average Session Duration
              </span>
              <span className='text-lg font-bold'>
                {Math.round(data.avgSessionDuration / 60)}m
              </span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-sm font-medium'>Bounce Rate</span>
              <span className='text-lg font-bold'>
                {data.bounceRate.toFixed(1)}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Growth Metrics</CardTitle>
            <CardDescription>Period over period comparison</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex items-center justify-between'>
              <span className='text-sm font-medium'>User Growth</span>
              <span
                className={`text-lg font-bold ${
                  data.userGrowth >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {data.userGrowth >= 0 ? '+' : ''}
                {data.userGrowth.toFixed(1)}%
              </span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-sm font-medium'>Total Events</span>
              <span className='text-lg font-bold'>
                {data.totalEvents.toLocaleString()}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
