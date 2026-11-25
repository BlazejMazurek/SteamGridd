import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AuthProvider, useAuth } from '../context/AuthContext'

const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>

// udajemy serwer: /user/me zwraca użytkownika, a adres z "protected" zwraca 401
function mockServer() {
  const fetchMock = vi.fn((url) => {
    if (String(url).includes('protected')) {
      return Promise.resolve({ ok: false, status: 401, json: async () => ({}) })
    }
    return Promise.resolve({
      ok: true,
      status: 200,
      json: async () => ({ id: 1, username: 'Jan' }),
    })
  })
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

describe('AuthContext', () => {
  beforeEach(() => {
    mockServer()
  })

  it('na początku nikt nie jest zalogowany', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })
    expect(result.current.isLoggedIn).toBe(false)
    expect(result.current.token).toBeNull()
  })

  it('login zapisuje token i pobiera dane użytkownika', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper })
    act(() => result.current.login('abc'))

    expect(result.current.isLoggedIn).toBe(true)
    expect(localStorage.getItem('token')).toBe('abc')
    await waitFor(() => expect(result.current.currentUser?.username).toBe('Jan'))
  })

  it('logout usuwa token i użytkownika', async () => {
    localStorage.setItem('token', 'abc')
    const { result } = renderHook(() => useAuth(), { wrapper })
    await waitFor(() => expect(result.current.currentUser).not.toBeNull())

    act(() => result.current.logout())

    expect(result.current.isLoggedIn).toBe(false)
    expect(localStorage.getItem('token')).toBeNull()
    expect(result.current.currentUser).toBeNull()
  })

  it('authFetch dokleja token do zapytania', async () => {
    localStorage.setItem('token', 'abc')
    const fetchMock = mockServer()
    const { result } = renderHook(() => useAuth(), { wrapper })
    await waitFor(() => expect(result.current.currentUser).not.toBeNull())

    await act(() => result.current.authFetch('http://test/dane'))

    expect(fetchMock).toHaveBeenCalledWith(
      'http://test/dane',
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'Bearer abc' }),
      })
    )
  })

  it('authFetch wylogowuje, gdy serwer odpowie 401', async () => {
    localStorage.setItem('token', 'abc')
    const { result } = renderHook(() => useAuth(), { wrapper })
    await waitFor(() => expect(result.current.currentUser).not.toBeNull())

    await act(() => result.current.authFetch('http://test/protected'))

    expect(result.current.isLoggedIn).toBe(false)
    expect(localStorage.getItem('token')).toBeNull()
  })
})
