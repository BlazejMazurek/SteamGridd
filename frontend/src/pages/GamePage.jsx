import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import StarRating from '../components/StarRating'
import ActionPanel from '../components/ActionPanel'
import { API_URL } from '../api'
import './GamePage.css'

const ratingOptions = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]

function GamePage() {
  const { id } = useParams()
  const [game, setGame] = useState(null)
  const [reviews, setReviews] = useState([])
  const [error, setError] = useState('')
  const [formError, setFormError] = useState('')
  const [text, setText] = useState('')
  const [rating, setRating] = useState('4')
  const token = localStorage.getItem('token')

  function loadReviews() {
    fetch(`${API_URL}/games/${id}/reviews`)
      .then((response) => response.json())
      .then((data) => setReviews(data))
      .catch(() => setReviews([]))
  }

  useEffect(() => {
    fetch(`${API_URL}/games/steam/${id}`)
      .then((response) => {
        if (!response.ok) throw new Error('not found')
        return response.json()
      })
      .then((data) => setGame(data))
      .catch(() => setError('Nie udało się pobrać gry.'))

    loadReviews()
  }, [id])

  async function handleSubmit(e) {
    e.preventDefault()
    setFormError('')
    if (text.trim() === '') return

    try {
      const response = await fetch(`${API_URL}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          rating: Number(rating),
          comment: text.trim(),
          appId: Number(id),
        }),
      })
      const data = await response.json()
      if (!response.ok) {
        setFormError(data.error || 'Nie udało się dodać komentarza.')
        return
      }
      setText('')
      loadReviews()
    } catch {
      setFormError('Nie udało się połączyć z serwerem.')
    }
  }

  if (error) return <main className="game-page"><p>{error}</p></main>
  if (!game) return <main className="game-page"><p>Ładowanie...</p></main>

  const genres = game.genres ? game.genres.map((g) => g.name).join(' / ') : ''

  const average =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + Number(r.rating), 0) / reviews.length).toFixed(1)
      : '-'

  return (
    <main className="game-page">
      <div className="game-cover">
        {game.coverImage && (
          <img
            src={game.coverImage}
            alt={game.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        )}
      </div>

      <div className="game-info">
        <div className="game-title-row">
          <h1>{game.title}</h1>
          <span>{game.releaseDate}</span>
          <span>{game.publisher ? game.publisher.name : ''}</span>
        </div>

        <p className="game-description">{game.description}</p>

        <h2 className="game-subtitle">Gatunek: {genres}</h2>

        <h2 className="game-subtitle">Średnia ocen:</h2>
        <div className="game-average">
          <span>★</span>
          <span>{average}</span>
        </div>

        <h2 className="game-comments-title">Dodaj komentarz:</h2>
        {token ? (
          <form className="comment-form" onSubmit={handleSubmit}>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Napisz, co sądzisz o tej grze..."
              rows={3}
            />
            <div className="comment-form-row">
              <label>
                Ocena:
                <select value={rating} onChange={(e) => setRating(e.target.value)}>
                  {ratingOptions.map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </label>
              <button type="submit">Dodaj</button>
            </div>
            {formError && <div className="auth-error">{formError}</div>}
          </form>
        ) : (
          <p>
            <Link to="/logowanie">Zaloguj się</Link>, aby dodać komentarz.
          </p>
        )}

        <h2 className="game-comments-title">Ostatnie komentarze:</h2>
        {reviews.length === 0 && <p>Brak komentarzy. Bądź pierwszy!</p>}
        {reviews.map((review) => (
          <div className="comment" key={review.id}>
            <div className="comment-avatar"></div>
            <div className="comment-body">
              <div className="comment-head">
                <span>{review.user ? review.user.username : 'użytkownik'}</span>
                <StarRating value={Number(review.rating)} size={16} />
              </div>
              <p>{review.comment}</p>
            </div>
          </div>
        ))}
      </div>

      <ActionPanel />
    </main>
  )
}

export default GamePage