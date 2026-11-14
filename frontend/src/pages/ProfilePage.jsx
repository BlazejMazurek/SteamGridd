import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import GameSection from '../components/GameSection'
import RatingsHistogram from '../components/RatingsHistogram'
import StarRating from '../components/StarRating'
import { API_URL } from '../api'
import './ProfilePage.css'

const statuses = [
  { key: 'played', label: 'ograne', icon: '🎮' },
  { key: 'liked', label: 'polubione', icon: '♥' },
  { key: 'completed', label: 'platyna', icon: '🏆' },
  { key: 'queued', label: 'do ogrania', icon: '⌛' },
]

const libraryFilters = [
  { key: 'all', label: 'Wszystkie' },
  { key: 'played', label: 'Ograne' },
  { key: 'liked', label: 'Polubione' },
  { key: 'completed', label: 'Platyna' },
]

function ProfilePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [lists, setLists] = useState({})
  const [message, setMessage] = useState('Ładowanie...')
  const [tab, setTab] = useState('overview')
  const [libraryFilter, setLibraryFilter] = useState('all')

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (!id && !token) {
      setMessage('login')
      return
    }

    const url = id ? `${API_URL}/user/${id}` : `${API_URL}/user/me`
    const options = id ? {} : { headers: { Authorization: `Bearer ${token}` } }

    fetch(url, options)
      .then((response) => {
        if (!response.ok) throw new Error('error')
        return response.json()
      })
      .then((data) => setUser(data))
      .catch(() => setMessage(id ? 'Nie znaleziono użytkownika.' : 'login'))
  }, [id])

  useEffect(() => {
    if (!user) return
    Promise.all(
      statuses.map((s) =>
        fetch(`${API_URL}/user/${user.id}/games/${s.key}`)
          .then((response) => response.json())
          .then((data) => (Array.isArray(data) ? data : []))
          .catch(() => [])
      )
    ).then((results) => {
      const next = {}
      statuses.forEach((s, index) => {
        next[s.key] = results[index]
      })
      setLists(next)
    })
  }, [user])

  function handleLogout() {
    localStorage.removeItem('token')
    navigate('/')
  }

  if (!user) {
    return (
      <main className="profile-page">
        {message === 'login' ? (
          <p>
            Zaloguj się, aby zobaczyć profil. <Link to="/logowanie">Przejdź do logowania</Link>
          </p>
        ) : (
          <p>{message}</p>
        )}
      </main>
    )
  }

  const badgeMap = {}
  statuses.forEach((s) => {
    ;(lists[s.key] || []).forEach((game) => {
      if (!badgeMap[game.appId]) badgeMap[game.appId] = []
      badgeMap[game.appId].push({ key: s.key, icon: s.icon, label: s.label })
    })
  })

  const ratingMap = {}
  user.reviews.forEach((review) => {
    ratingMap[review.game.appId] = Number(review.rating)
  })

  function toCard(game) {
    return {
      id: game.appId,
      appId: game.appId,
      title: game.title,
      coverImage: game.coverImage,
      badges: badgeMap[game.appId],
    }
  }

  const favoriteGames = user.favoriteGames.map(toCard)

  const recentGames = (lists.played || []).slice(0, 20).map((game) => ({
    ...toCard(game),
    rating: ratingMap[game.appId],
  }))

  const queue = (lists.queued || []).map(toCard)

  const seen = {}
  const libraryAll = []
  ;['played', 'liked', 'completed'].forEach((key) => {
    ;(lists[key] || []).forEach((game) => {
      if (!seen[game.appId]) {
        seen[game.appId] = true
        libraryAll.push(game)
      }
    })
  })

  const libraryShown = libraryFilter === 'all' ? libraryAll : lists[libraryFilter] || []
  const library = libraryShown.map(toCard)

  const ratingCounts = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map((value) => ({
    value,
    count: user.reviews.filter((review) => Number(review.rating) === value).length,
  }))

  const comments = user.reviews.filter((review) => review.comment)

  return (
    <main className="profile-page">
      <div className="profile-main">
        <div className="profile-header">
          <div className="profile-avatar"></div>
          <div>
            <h1>{user.username}</h1>
            <p>ulubiony gatunek: {user.favoriteGenre ? user.favoriteGenre.name : 'brak'}</p>
          </div>
          {!id && (
            <button className="logout-button" onClick={handleLogout}>
              Wyloguj
            </button>
          )}
        </div>

        <div className="profile-tabs">
          <button
            className={tab === 'overview' ? 'profile-tab active' : 'profile-tab'}
            onClick={() => setTab('overview')}
          >
            Przegląd
          </button>
          <button
            className={tab === 'queue' ? 'profile-tab active' : 'profile-tab'}
            onClick={() => setTab('queue')}
          >
            Do ogrania ({queue.length})
          </button>
          <button
            className={tab === 'library' ? 'profile-tab active' : 'profile-tab'}
            onClick={() => setTab('library')}
          >
            Biblioteka ({libraryAll.length})
          </button>
          <button
            className={tab === 'comments' ? 'profile-tab active' : 'profile-tab'}
            onClick={() => setTab('comments')}
          >
            Komentarze ({comments.length})
          </button>
        </div>

        {tab === 'overview' && (
          <>
            <GameSection
              title="Ulubione gry"
              games={favoriteGames}
              columns={4}
              emptyText="Brak ulubionych gier."
            />
            <GameSection
              title="Ostatnio ograne gry"
              games={recentGames}
              scroll
              emptyText="Brak ograniych gier. Kliknij „ograne” na stronie gry."
            />
          </>
        )}

        {tab === 'queue' && (
          <GameSection
            title="Do ogrania"
            games={queue}
            columns={4}
            emptyText="Brak gier w kolejce."
          />
        )}

        {tab === 'library' && (
          <>
            <div className="library-filters">
              {libraryFilters.map((f) => (
                <button
                  key={f.key}
                  className={libraryFilter === f.key ? 'library-chip active' : 'library-chip'}
                  onClick={() => setLibraryFilter(f.key)}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <GameSection
              title="Biblioteka"
              games={library}
              columns={4}
              emptyText="Brak gier w tej kategorii."
            />
          </>
        )}

        {tab === 'comments' && (
          <div className="profile-comments">
            {comments.length === 0 && <p>Ten użytkownik nie dodał jeszcze komentarzy.</p>}
            {comments.map((review) => (
              <div className="profile-comment" key={review.id}>
                <Link to={`/gra/${review.game.appId}`} className="profile-comment-cover">
                  {review.game.coverImage && (
                    <img src={review.game.coverImage} alt={review.game.title} />
                  )}
                </Link>
                <div className="profile-comment-body">
                  <div className="profile-comment-head">
                    <Link to={`/gra/${review.game.appId}`}>{review.game.title}</Link>
                    <StarRating value={Number(review.rating)} size={16} />
                  </div>
                  <p>{review.comment}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <RatingsHistogram counts={ratingCounts} />
    </main>
  )
}

export default ProfilePage