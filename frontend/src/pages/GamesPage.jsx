import { useState } from 'react'
import GameCard from '../components/GameCard'
import './GamesPage.css'

const allGames = [
  { id: 1, title: 'Counter-Strike 2' },
  { id: 2, title: 'Dota 2' },
  { id: 3, title: 'Cyberpunk 2077' },
  { id: 4, title: 'The Witcher 3' },
  { id: 5, title: 'Elden Ring' },
  { id: 6, title: 'Portal 2' },
  { id: 7, title: 'Half-Life 2' },
  { id: 8, title: 'Stardew Valley' },
  { id: 9, title: 'Terraria' },
  { id: 10, title: 'Hollow Knight' },
  { id: 11, title: 'Hades' },
  { id: 12, title: 'Left 4 Dead 2' },
  { id: 13, title: 'Rust' },
  { id: 14, title: 'Valheim' },
  { id: 15, title: 'Baldur\'s Gate 3' },
]

function GamesPage() {
  const [query, setQuery] = useState('')

  const filteredGames = allGames.filter((game) =>
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

      {filteredGames.length === 0 ? (
        <p>Nie znaleziono gier.</p>
      ) : (
        <div className="games-grid">
          {filteredGames.map((game) => (
            <GameCard key={game.id} id={game.id} title={game.title} />
          ))}
        </div>
      )}
    </main>
  )
}

export default GamesPage