import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { API_URL } from '../api'
import './AuthPage.css'

function RegisterPage() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    if (password.length < 6) {
      setError('Hasło musi mieć co najmniej 6 znaków.')
      return
    }
    setError('')
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      })
      const data = await response.json()
      if (!response.ok) {
        setError(data.error || 'Błąd rejestracji')
        return
      }
      navigate('/logowanie')
    } catch {
      setError('Nie udało się połączyć z serwerem.')
    }
  }

  return (
    <main className="auth-page">
      <h1>Rejestracja</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Nazwa użytkownika
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </label>
        <label>
          E-mail
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Hasło
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        {error && <div className="auth-error">{error}</div>}
        <button type="submit">Zarejestruj się</button>
      </form>
      <p>
        Masz już konto? <Link to="/logowanie">Zaloguj się</Link>
      </p>
    </main>
  )
}

export default RegisterPage