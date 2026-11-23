import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import GameSection from '../components/GameSection'
import { API_URL } from '../api'
import './HomePage.css'

function HomePage() {
  const [games, setGames] = useState([])
  const [usersCount, setUsersCount] = useState(null)
  const [error, setError] = useState('')
  const token = localStorage.getItem('token')

  useEffect(() => {
    fetch(`${API_URL}/games`)
      .then((response) => response.json())
      .then((data) => setGames(Array.isArray(data) ? data : []))
      .catch(() => setError('Nie udało się pobrać gier. Czy serwer działa?'))

    fetch(`${API_URL}/user`)
      .then((response) => response.json())
      .then((data) => setUsersCount(Array.isArray(data) ? data.length : null))
      .catch(() => {})
  }, [])

  const safeGames = games.filter((game) => !game.isAdult)
  const newest = [...safeGames].sort((a, b) => b.id - a.id).slice(0, 5)
  const popular = safeGames.filter((game) => !newest.includes(game)).slice(0, 5)
  const heroCovers = safeGames.filter((game) => game.coverImage).slice(0, 3)

  const genreIds = new Set()
  games.forEach((game) => {
    ;(game.genres || []).forEach((genre) => genreIds.add(genre.id))
  })

  return (
    <main className="home">
      <section className="hero">
        <div className="hero-text">
          <h1>
            Oceniaj gry.
            <br />
            <span>Prowadź swój dziennik.</span>
          </h1>
          <p>Zapisuj, w co grałeś, wystawiaj oceny i sprawdzaj, co polecają inni gracze.</p>
          <div className="hero-buttons">
            {token ? (
              <>
                <Link to="/gry" className="btn-primary">Przeglądaj gry</Link>
                <Link to="/profil" className="btn-secondary">Mój profil</Link>
              </>
            ) : (
              <>
                <Link to="/rejestracja" className="btn-primary">Dołącz za darmo</Link>
                <Link to="/gry" className="btn-secondary">Przeglądaj gry</Link>
              </>
            )}
          </div>
        </div>

        <div className="hero-covers">
          {heroCovers.map((game) => (
            <Link key={game.id} to={`/gra/${game.appId}`} className="hero-cover" title={game.title}>
              <img src={game.coverImage} alt={game.title} />
            </Link>
          ))}
        </div>
      </section>

      <section className="stats">
        <div>
          <div className="stat-number">{games.length.toLocaleString('pl-PL')}</div>
          <div className="stat-label">gier w bazie</div>
        </div>
        <div>
          <div className="stat-number">{genreIds.size}</div>
          <div className="stat-label">gatunków</div>
        </div>
        <div>
          <div className="stat-number">{usersCount === null ? '-' : usersCount}</div>
          <div className="stat-label">użytkowników</div>
        </div>
      </section>

      {error && <p className="home-message">{error}</p>}

      <GameSection title="Nowo dodane gry" games={newest} linkText="Zobacz więcej" />
      <GameSection
        title="Najpopularniejsze gry w tym tygodniu"
        games={popular}
        linkText="Zobacz więcej"
      />
    </main>
  )
}

export default HomePage