import { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import GameSection from '../components/GameSection'
import { API_URL } from '../api'
import { useAuth } from '../context/AuthContext'
import './HomePage.css'

function seededShuffle(list, seed) {
  const result = [...list]
  let s = seed
  function rand() {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

function HomePage() {
  const navigate = useNavigate()
  const { isLoggedIn, currentUser } = useAuth()
  const [games, setGames] = useState([])
  const [usersCount, setUsersCount] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchText, setSearchText] = useState('')
  const [seed] = useState(() => Math.floor(Date.now() / 86400000))

  useEffect(() => {
    fetch(`${API_URL}/games`)
      .then((response) => response.json())
      .then((data) => setGames(Array.isArray(data) ? data : []))
      .catch(() => setError('Nie udało się pobrać gier. Czy serwer działa?'))
      .finally(() => setLoading(false))

    fetch(`${API_URL}/user`)
      .then((response) => response.json())
      .then((data) => setUsersCount(Array.isArray(data) ? data.length : null))
      .catch(() => {})
  }, [])

  const safeGames = games.filter((game) => !game.isAdult)
  const newest = [...safeGames].sort((a, b) => b.id - a.id).slice(0, 5)
  const popular = safeGames.filter((game) => !newest.includes(game)).slice(0, 5)
  const heroCovers = safeGames.filter((game) => game.coverImage).slice(0, 3)

  const favoriteGenre = currentUser ? currentUser.favoriteGenre : null
  const favoriteGenreId = favoriteGenre ? favoriteGenre.id : null

  const recommended = useMemo(() => {
    if (!favoriteGenreId) return []
    const pool = games.filter(
      (game) =>
        !game.isAdult &&
        game.coverImage &&
        (game.genres || []).some((genre) => genre.id === favoriteGenreId)
    )
    return seededShuffle(pool, seed).slice(0, 5)
  }, [games, favoriteGenreId, seed])

  const genreIds = new Set()
  games.forEach((game) => {
    ;(game.genres || []).forEach((genre) => genreIds.add(genre.id))
  })

  function handleSearch(e) {
    e.preventDefault()
    const text = searchText.trim()
    navigate(text ? `/gry?szukaj=${encodeURIComponent(text)}` : '/gry')
  }

  function randomGame() {
    const pool = safeGames.filter((game) => game.coverImage)
    if (pool.length === 0) return
    const game = pool[Math.floor(Math.random() * pool.length)]
    navigate(`/gra/${game.appId}`)
  }

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

          <form className="hero-search" onSubmit={handleSearch}>
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Szukaj gry po tytule..."
              aria-label="Szukaj gry po tytule"
            />
            <button type="submit">Szukaj</button>
          </form>

          <div className="hero-buttons">
            {isLoggedIn ? (
              <Link to="/profil" className="btn-secondary">Mój profil</Link>
            ) : (
              <Link to="/rejestracja" className="btn-primary">Dołącz za darmo</Link>
            )}
            <Link to="/gry" className="btn-secondary">Przeglądaj gry</Link>
            <button type="button" className="btn-ghost" onClick={randomGame} disabled={loading}>
              Wylosuj grę
            </button>
          </div>
        </div>

        <div className="hero-covers">
          {loading
            ? [0, 1, 2].map((index) => (
                <div key={index} className="skeleton hero-cover" aria-hidden="true"></div>
              ))
            : heroCovers.map((game) => (
                <Link
                  key={game.id}
                  to={`/gra/${game.appId}`}
                  className="hero-cover"
                  title={game.title}
                >
                  <img src={game.coverImage} alt={game.title} />
                </Link>
              ))}
        </div>
      </section>

      <section className="stats">
        <div>
          <div className="stat-number">{loading ? '-' : games.length.toLocaleString('pl-PL')}</div>
          <div className="stat-label">gier w bazie</div>
        </div>
        <div>
          <div className="stat-number">{loading ? '-' : genreIds.size}</div>
          <div className="stat-label">gatunków</div>
        </div>
        <div>
          <div className="stat-number">{usersCount === null ? '-' : usersCount}</div>
          <div className="stat-label">użytkowników</div>
        </div>
      </section>

      {error && <p className="home-message">{error}</p>}

      {isLoggedIn && favoriteGenre && (
        <GameSection
          title={`Może Ci się spodobać: ${favoriteGenre.name}`}
          games={recommended}
          linkText="Zobacz więcej"
          linkTo={`/gry?gatunek=${favoriteGenre.id}`}
          loading={loading}
        />
      )}

      {isLoggedIn && currentUser && !favoriteGenre && (
        <div className="home-hint">
          Ustaw ulubiony gatunek w <Link to="/ustawienia">ustawieniach</Link>, a pokażemy tu gry,
          które mogą Ci się spodobać.
        </div>
      )}

      <GameSection
        title="Nowo dodane gry"
        games={newest}
        linkText="Zobacz więcej"
        loading={loading}
      />
      <GameSection
        title="Najpopularniejsze gry w tym tygodniu"
        games={popular}
        linkText="Zobacz więcej"
        loading={loading}
      />
    </main>
  )
}

export default HomePage