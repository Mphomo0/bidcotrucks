import React, { Suspense } from 'react'
import InventoryComponent from '@/components/sections/inventory/InventoryComponent'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Used Trucks & Trailers Inventory | Bidco Trucks South Africa',
  description:
    'Bidco Trucks (Pty) Ltd specializes in buying and selling clean second-hand trucks, trailers, and plant equipment. Serving South Africa and neighboring countries, we offer quality vehicles at competitive prices.',
}

export default function InventoryPage() {
  return (
    <Suspense fallback={<div>Loading inventory...</div>}>
      <InventoryComponent />
    </Suspense>
  )
}
