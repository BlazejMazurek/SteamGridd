import { useState } from 'react'
import { Link } from 'react-router-dom'
import './AuthPage.css'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    console.log('Logowanie:', email, password)
  }

  return (
    <main className="auth-page">
      <h1>Logowanie</h1>
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Zaloguj się</button>
      </form>
      <p>
        Nie masz konta? <Link to="/rejestracja">Zarejestruj się</Link>
      </p>
    </main>
  )
}

export default LoginPage