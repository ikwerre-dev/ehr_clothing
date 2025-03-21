'use client'

import { Suspense } from 'react'
import CartContent from './CartContent' // Create this component with the main cart content

export default function CartPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CartContent />
    </Suspense>
  )
}