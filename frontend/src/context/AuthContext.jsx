import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { API_URL } from '../api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [currentUser, setCurrentUser] = useState(null)

  const login = useCallback((newToken) => {
    localStorage.setItem('token', newToken)
    setToken(newToken)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    setToken(null)
    setCurrentUser(null)
  }, [])

  // fetch, który sam dokłada token i wylogowuje, gdy token jest nieważny
  const authFetch = useCallback(
    async (url, options = {}) => {
      const headers = { ...(options.headers || {}) }
      if (token) headers.Authorization = `Bearer ${token}`

      const response = await fetch(url, { ...options, headers })

      if (token && (response.status === 401 || response.status === 403)) {
        logout()
      }
      return response
    },
    [token, logout]
  )

  const refreshUser = useCallback(async () => {
    if (!token) {
      setCurrentUser(null)
      return
    }
    try {
      const response = await authFetch(`${API_URL}/user/me`)
      if (!response.ok) {
        setCurrentUser(null)
        return
      }
      const data = await response.json()
      setCurrentUser({
        id: data.id,
        username: data.username,
        avatarUrl: data.avatarUrl || '',
        favoriteGenre: data.favoriteGenre || null,
      })
    } catch {
      setCurrentUser(null)
    }
  }, [token, authFetch])

  useEffect(() => {
    refreshUser()
  }, [refreshUser])

  return (
    <AuthContext.Provider
      value={{
        token,
        isLoggedIn: Boolean(token),
        currentUser,
        login,
        logout,
        authFetch,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}