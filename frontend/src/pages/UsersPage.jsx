import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { API_URL } from '../api'
import './UsersPage.css'

function UsersPage() {
  const [users, setUsers] = useState([])
  const [query, setQuery] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`${API_URL}/user`)
      .then((response) => {
        if (!response.ok) throw new Error('error')
        return response.json()
      })
      .then((data) => setUsers(data))
      .catch(() => setError('Nie udało się pobrać użytkowników.'))
  }, [])

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <main className="users-page">
      <h1>Użytkownicy</h1>

      <input
        className="users-search"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Szukaj użytkownika po nazwie..."
      />

      {error && <p>{error}</p>}

      {!error && filteredUsers.length === 0 ? (
        <p>Nie znaleziono użytkowników.</p>
      ) : (
        <div className="users-list">
          {filteredUsers.map((user) => (
            <Link to={`/uzytkownik/${user.id}`} className="user-row" key={user.id}>
              <div className="user-avatar"></div>
              <div className="user-info">
                <span className="user-name">{user.username}</span>
                <span className="user-meta">
                  ulubiony gatunek: {user.favoriteGenre ? user.favoriteGenre.name : 'brak'}
                  {user._count ? ` · ocenione gry: ${user._count.reviews}` : ''}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}

export default UsersPage