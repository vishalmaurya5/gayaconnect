'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const token = Cookies.get('gc_token')
      if (token) {
        // Fetch user profile
        const res = await fetch('/api/profile', {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.ok) {
          const data = await res.json()
          setUser(data.user)
        } else {
          Cookies.remove('gc_token')
          setUser(null)
        }
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
        Cookies.set('gc_token', data.token, { expires: 30 })
        setUser(data.user)
        router.push(data.user.role === 'vendor' ? '/vendor/dashboard' : '/profile')
        return { success: true }
      }
      return { success: false, message: data.message }
    } catch (error) {
      return { success: false, message: 'Login failed' }
    }
  }

  const logout = () => {
    Cookies.remove('gc_token')
    setUser(null)
    router.push('/login')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, checkUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
