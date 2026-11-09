import { useState, useEffect } from 'react'
import GameSection from '../components/GameSection'
import { API_URL } from '../api'

function HomePage() {
  const [games, setGames] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`${API_URL}/games`)
      .then((response) => response.json())
      .then((data) => setGames(data))
      .catch(() => setError('Nie udało się pobrać gier. Czy serwer działa?'))
  }, [])

  return (
    <main style={{ maxWidth: '1000px', margin: '60px auto', padding: '0 20px' }}>
      {error && <p>{error}</p>}
      <GameSection title="nowo dodane gry" games={games.slice(0, 5)} linkText="Zobacz więcej" />
      <GameSection title="najpopularniejsze gry w tym tygodniu" games={games.slice(5, 10)} linkText="Zobacz więcej" />
    </main>
  )
}

export default HomePage