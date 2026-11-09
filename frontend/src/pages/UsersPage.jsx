import { useState } from 'react'
import { Link } from 'react-router-dom'
import './UsersPage.css'

const allUsers = [
  { id: 1, name: 'Kuba', favoriteGenre: 'FPS', ratings: 120 },
  { id: 2, name: 'Ania', favoriteGenre: 'RPG', ratings: 85 },
  { id: 3, name: 'Marek', favoriteGenre: 'Strategie', ratings: 42 },
  { id: 4, name: 'Zuzia', favoriteGenre: 'Indie', ratings: 67 },
  { id: 5, name: 'Błażej', favoriteGenre: 'Survival', ratings: 33 },
  { id: 6, name: 'Ola', favoriteGenre: 'Platformówki', ratings: 98 },
]

function UsersPage() {
  const [query, setQuery] = useState('')

  const filteredUsers = allUsers.filter((user) =>
    user.name.toLowerCase().includes(query.toLowerCase())
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

      {filteredUsers.length === 0 ? (
        <p>Nie znaleziono użytkowników.</p>
      ) : (
        <div className="users-list">
          {filteredUsers.map((user) => (
            <Link to={`/uzytkownik/${user.id}`} className="user-row" key={user.id}>
              <div className="user-avatar"></div>
              <div className="user-info">
                <span className="user-name">{user.name}</span>
                <span className="user-meta">
                  ulubiony gatunek: {user.favoriteGenre} · ocenione gry: {user.ratings}
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