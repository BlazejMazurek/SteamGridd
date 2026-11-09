import { useState, useEffect } from 'react'
import GameCard from '../components/GameCard'
import { API_URL } from '../api'
import './GamesPage.css'

function GamesPage() {
  const [games, setGames] = useState([])
  const [query, setQuery] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`${API_URL}/games`)
      .then((response) => response.json())
      .then((data) => setGames(data))
      .catch(() => setError('Nie udało się pobrać gier. Czy serwer działa?'))
  }, [])

  const filteredGames = games.filter((game) =>
    game.title.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <main className="games-page">
      <h1>Gry</h1>

      <input
        className="games-search"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Szukaj gry po tytule..."
      />

      {error && <p>{error}</p>}

      {filteredGames.length === 0 && !error ? (
        <p>Nie znaleziono gier.</p>
      ) : (
        <div className="games-grid">
          {filteredGames.map((game) => (
            <GameCard
              key={game.id}
              id={game.appId}
              title={game.title}
              image={game.coverImage}
            />
          ))}
        </div>
      )}
    </main>
  )
}

export default GamesPage