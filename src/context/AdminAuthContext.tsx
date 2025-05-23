'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import Cookies from 'js-cookie'

interface AdminAuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

const AdminAuthContext = createContext<AdminAuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  login: async () => false,
  logout: () => { },
})

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const auth = Cookies.get('adminAuth')
    if (auth) {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    // In a real app, this would be an API call
    if (email === 'admin@ehr.com' && password === 'admin123') {
      // Set cookie to expire in 7 days
      Cookies.set('adminAuth', 'true', { expires: 7, secure: true })
      setIsAuthenticated(true)
      return true
    }
    return false
  }

  const logout = () => {
    Cookies.remove('adminAuth')
    setIsAuthenticated(false)
  }

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export const useAdminAuth = () => useContext(AdminAuthContext)