import { createContext, useContext, useState, useEffect } from 'react'
import { getMe, login as loginApi, register as registerApi, logout as logoutApi } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMe()
      .then(res => setUser(res.data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  const login = async (data) => {
    const res = await loginApi(data)
    setUser(res.data.user)
    return res.data
  }

  const register = async (data) => {
    const res = await registerApi(data)
    setUser(res.data.user)
    return res.data
  }

  const logout = async () => {
    await logoutApi()
    setUser(null)
  }

  const refreshUser = async () => {
    try {
      const res = await getMe()
      setUser(res.data.user)
    } catch {}
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
