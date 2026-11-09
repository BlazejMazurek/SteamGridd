import { useState } from 'react'
import { Link } from 'react-router-dom'
import './AuthPage.css'

function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (password.length < 6) {
      setError('Hasło musi mieć co najmniej 6 znaków.')
      return
    }
    setError('')
    console.log('Rejestracja:', name, email, password)
  }

  return (
    <main className="auth-page">
      <h1>Rejestracja</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Nazwa użytkownika
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label>
          E-mail
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Hasło
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
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