'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import SubscriptionModal from '@/components/subscription/SubscriptionModal'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      // The browser automatically sends the HTTP-only gc_access cookie.
      const res = await fetch('/api/profile')
      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error('Auth check error:', error)
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      })
      const data = await res.json()
      if (res.ok) {
        setUser(data.user)
        router.push(data.user.role === 'vendor' ? '/vendor/dashboard' : '/profile')
        return { success: true }
      }
      return { success: false, message: data.message }
    } catch (error) {
      return { success: false, message: 'Login failed' }
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch (err) {
      console.error("Logout error", err)
    }
    setUser(null)
    router.push('/login')
  }

  const openSubscriptionModal = () => setIsSubscriptionModalOpen(true)
  const closeSubscriptionModal = () => setIsSubscriptionModalOpen(false)

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, checkUser, openSubscriptionModal }}>
      {children}
      <SubscriptionModal isOpen={isSubscriptionModalOpen} onClose={closeSubscriptionModal} />
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
