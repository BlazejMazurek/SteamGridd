import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import GameCard from '../components/GameCard'
import { API_URL } from '../api'
import './GamesPage.css'

const PAGE_SIZE = 60

function GamesPage() {
  const [games, setGames] = useState([])
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [publisherText, setPublisherText] = useState('')
  const [open, setOpen] = useState(false)
  const [limit, setLimit] = useState(PAGE_SIZE)
  const [searchParams, setSearchParams] = useSearchParams()

  const genreId = searchParams.get('gatunek') || ''
  const publisherId = searchParams.get('wydawca') || ''

  useEffect(() => {
    fetch(`${API_URL}/games`)
      .then((response) => response.json())
      .then((data) => setGames(Array.isArray(data) ? data : []))
      .catch(() => setError('Nie udało się pobrać gier. Czy serwer działa?'))
  }, [])

  const genres = useMemo(() => {
    const map = {}
    games.forEach((game) => {
      ;(game.genres || []).forEach((genre) => {
        map[genre.id] = genre.name
      })
    })
    return Object.entries(map)
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [games])

  const publishers = useMemo(() => {
    const map = {}
    games.forEach((game) => {
      if (game.publisher) map[game.publisher.id] = game.publisher.name
    })
    return Object.entries(map).map(([id, name]) => ({ id, name }))
  }, [games])

  const selectedPublisher = publishers.find((p) => p.id === publisherId)

  const text = publisherText.trim().toLowerCase()
  const suggestions =
    text.length >= 2
      ? publishers.filter((p) => p.name.toLowerCase().includes(text)).slice(0, 6)
      : []

  function setFilter(key, value) {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    setSearchParams(next)
    setLimit(PAGE_SIZE)
  }

  function pickPublisher(publisher) {
    setFilter('wydawca', publisher.id)
    setPublisherText('')
    setOpen(false)
  }

  function clearFilters() {
    setSearchParams({})
    setQuery('')
    setPublisherText('')
    setLimit(PAGE_SIZE)
  }

  const filtered = games.filter((game) => {
    if (query && !game.title.toLowerCase().includes(query.toLowerCase())) return false
    if (genreId && !(game.genres || []).some((g) => String(g.id) === genreId)) return false
    if (publisherId && String(game.publisher ? game.publisher.id : '') !== publisherId) return false
    return true
  })

  const shown = filtered.slice(0, limit)
  const hasFilters = query || genreId || publisherId

  return (
    <main className="games-page">
      <h1>Gry</h1>

      <input
        className="games-search"
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          setLimit(PAGE_SIZE)
        }}
        placeholder="Szukaj gry po tytule..."
      />

      <div className="games-filters">
        <label className="games-filter">
          Gatunek
          <select value={genreId} onChange={(e) => setFilter('gatunek', e.target.value)}>
            <option value="">Wszystkie gatunki</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
        </label>

        <div className="games-filter games-filter-publisher">
          <label htmlFor="publisher-input">Wydawca</label>
          <input
            id="publisher-input"
            type="text"
            autoComplete="off"
            value={publisherText}
            placeholder="Wpisz co najmniej 2 litery..."
            onChange={(e) => {
              setPublisherText(e.target.value)
              setOpen(true)
            }}
            onFocus={() => setOpen(true)}
            onBlur={() => setOpen(false)}
          />
          {open && text.length >= 2 && (
            <div className="publisher-suggestions">
              {suggestions.length === 0 && (
                <div className="publisher-empty">Brak wydawców o takiej nazwie</div>
              )}
              {suggestions.map((publisher) => (
                <div
                  key={publisher.id}
                  className="publisher-suggestion"
                  onMouseDown={() => pickPublisher(publisher)}
                >
                  {publisher.name}
                </div>
              ))}
            </div>
          )}
          {selectedPublisher && (
            <div className="publisher-chip">
              <span>Wydawca: {selectedPublisher.name}</span>
              <button type="button" aria-label="Usuń filtr wydawcy" onClick={() => setFilter('wydawca', '')}>
                ×
              </button>
            </div>
          )}
        </div>

        {hasFilters && (
          <button type="button" className="games-clear" onClick={clearFilters}>
            Wyczyść filtry
          </button>
        )}
      </div>

      {error && <p>{error}</p>}

      {!error && <div className="games-count">Wyniki: {filtered.length}</div>}

      {!error && filtered.length === 0 ? (
        <p>Nie znaleziono gier.</p>
      ) : (
        <div className="games-grid">
          {shown.map((game) => (
            <GameCard
              key={game.id}
              id={game.appId}
              title={game.title}
              image={game.coverImage}
            />
          ))}
        </div>
      )}

      {filtered.length > limit && (
        <button type="button" className="games-more" onClick={() => setLimit(limit + PAGE_SIZE)}>
          Pokaż więcej
        </button>
      )}
    </main>
  )
}

export default GamesPage