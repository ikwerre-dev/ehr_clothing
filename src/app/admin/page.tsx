'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAdminAuth } from '@/context/AdminAuthContext'

export default function AdminPage() {
  const { isAuthenticated } = useAdminAuth()
  const router = useRouter()

  console.log(isAuthenticated)
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/admin/dashboard')
    } else {
      router.push('/admin/login')
    }
  }, [isAuthenticated])

  return null
}