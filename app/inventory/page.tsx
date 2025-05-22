import React, { Suspense } from 'react'
import InventoryComponent from '@/components/sections/inventory/InventoryComponent'

export default function InventoryPage() {
  return (
    <Suspense fallback={<div>Loading inventory...</div>}>
      <InventoryComponent />
    </Suspense>
  )
}
