import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { describe, it, expect, vi } from 'vitest'
import ProtectedRoute from '../components/ProtectedRoute'
import { useAuth } from '../context/AuthContext'

// podmieniamy useAuth, żeby sterować tym, czy ktoś jest zalogowany
vi.mock('../context/AuthContext', () => ({ useAuth: vi.fn() }))

function renderApp() {
  return render(
    <MemoryRouter initialEntries={['/ustawienia']}>
      <Routes>
        <Route
          path="/ustawienia"
          element={
            <ProtectedRoute>
              <p>Ustawienia konta</p>
            </ProtectedRoute>
          }
        />
        <Route path="/logowanie" element={<p>Strona logowania</p>} />
      </Routes>
    </MemoryRouter>
  )
}

describe('ProtectedRoute', () => {
  it('przekierowuje do logowania, gdy użytkownik nie jest zalogowany', () => {
    useAuth.mockReturnValue({ isLoggedIn: false })
    renderApp()
    expect(screen.getByText('Strona logowania')).toBeInTheDocument()
    expect(screen.queryByText('Ustawienia konta')).not.toBeInTheDocument()
  })

  it('pokazuje stronę, gdy użytkownik jest zalogowany', () => {
    useAuth.mockReturnValue({ isLoggedIn: true })
    renderApp()
    expect(screen.getByText('Ustawienia konta')).toBeInTheDocument()
  })
})
