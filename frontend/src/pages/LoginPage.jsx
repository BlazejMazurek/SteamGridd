import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { API_URL } from '../api'
import './AuthPage.css'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await response.json()
      if (!response.ok) {
        setError(data.error || 'Błąd logowania')
        return
      }
      localStorage.setItem('token', data.token)
      navigate('/profil')
    } catch {
      setError('Nie udało się połączyć z serwerem.')
    }
  }

  return (
    <main className="auth-page">
      <h1>Logowanie</h1>
      <form onSubmit={handleSubmit}>
        <label>
          E-mail
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Hasło
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        {error && <div className="auth-error">{error}</div>}
        <button type="submit">Zaloguj się</button>
      </form>
      <p>
        Nie masz konta? <Link to="/rejestracja">Zarejestruj się</Link>
      </p>
    </main>
  )
}

export default LoginPage