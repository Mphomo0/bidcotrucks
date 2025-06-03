'use client'

import * as React from 'react'
import Image from 'next/image'
import { Bot, Settings2, SquareTerminal } from 'lucide-react'
import Link from 'next/link'

import { NavMain } from '@/components/sections/dashboard/NavMain'
import { NavUser } from '@/components/sections/dashboard/NavUser'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'

const data = {
  navMain: [
    {
      title: 'Inventory Stock',
      url: '/dashboard/vehicles',
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: 'All Vehicles',
          url: '/dashboard/vehicles',
        },
        {
          title: 'Add Vehicle',
          url: '/dashboard/vehicles/addVehicles',
        },
      ],
    },
    {
      title: 'Users',
      url: '/dashboard/users',
      icon: Bot,
      items: [
        {
          title: 'Add User',
          url: '/dashboard/users/adduser',
        },
        {
          title: 'View Users',
          url: '/dashboard/users',
        },
      ],
    },
    {
      title: 'Settings',
      url: '#',
      icon: Settings2,
      items: [
        {
          title: 'Category',
          url: '/dashboard/category',
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader>
        <Link href='/dashboard'>
          <Image
            src='/images/bidco_logo.png'
            alt='Logo'
            width={100}
            height={100}
          />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
