import { useState, useEffect, useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import StarRating from '../components/StarRating'
import ActionPanel from '../components/ActionPanel'
import GameSection from '../components/GameSection'
import { API_URL } from '../api'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import './GamePage.css'

const ratingOptions = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]

function GamePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { token, authFetch } = useAuth()
  const { showToast } = useToast()
  const [game, setGame] = useState(null)
  const [reviews, setReviews] = useState([])
  const [similarRaw, setSimilarRaw] = useState([])
  const [error, setError] = useState('')
  const [formError, setFormError] = useState('')
  const [text, setText] = useState('')
  const [rating, setRating] = useState('4')
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [fileKey, setFileKey] = useState(0)
  const [ageConfirmed, setAgeConfirmed] = useState(
    localStorage.getItem('ageConfirmed') === 'yes'
  )

  function loadReviews() {
    fetch(`${API_URL}/games/${id}/reviews`)
      .then((response) => response.json())
      .then((data) => setReviews(Array.isArray(data) ? data : []))
      .catch(() => setReviews([]))
  }

  useEffect(() => {
    setAgeConfirmed(localStorage.getItem('ageConfirmed') === 'yes')
    setGame(null)
    setError('')
    setSimilarRaw([])

    fetch(`${API_URL}/games/steam/${id}`)
      .then((response) => {
        if (!response.ok) throw new Error('not found')
        return response.json()
      })
      .then((data) => setGame(data))
      .catch(() => setError('Nie udało się pobrać gry.'))

    loadReviews()
  }, [id])

  useEffect(() => {
    if (!game || !game.genres || game.genres.length === 0) return
    fetch(`${API_URL}/games?genres=${game.genres[0].id}`)
      .then((response) => response.json())
      .then((data) => setSimilarRaw(Array.isArray(data) ? data : []))
      .catch(() => setSimilarRaw([]))
  }, [game])

  const similar = useMemo(() => {
    if (!game) return []
    const genreIds = new Set((game.genres || []).map((genre) => genre.id))
    return similarRaw
      .filter((other) => other.id !== game.id && !other.isAdult && other.coverImage)
      .map((other) => {
        const shared = (other.genres || []).filter((genre) => genreIds.has(genre.id)).length
        const samePublisher =
          game.publisher && other.publisher && game.publisher.id === other.publisher.id
        return { other, score: shared * 2 + (samePublisher ? 3 : 0) }
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map((item) => item.other)
  }, [similarRaw, game])

  function handleImage(e) {
    const chosen = e.target.files[0]
    if (!chosen) return

    if (!chosen.type.startsWith('image/')) {
      setFormError('Wybierz plik graficzny (JPG lub PNG).')
      return
    }
    if (chosen.size > 5 * 1024 * 1024) {
      setFormError('Zdjęcie jest za duże (maksymalnie 5 MB).')
      return
    }

    setFormError('')
    setImageFile(chosen)
    setImagePreview(URL.createObjectURL(chosen))
  }

  function removeImage() {
    setImageFile(null)
    setImagePreview('')
    setFileKey(fileKey + 1)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setFormError('')
    if (text.trim() === '') return

    const formData = new FormData()
    formData.append('rating', rating)
    formData.append('comment', text.trim())
    formData.append('appId', id)
    if (imageFile) formData.append('image', imageFile)

    try {
      const response = await authFetch(`${API_URL}/reviews`, {
        method: 'POST',
        body: formData,
      })
      const data = await response.json()
      if (!response.ok) {
        setFormError(data.error || 'Nie udało się dodać komentarza.')
        return
      }
      setText('')
      removeImage()
      showToast('Komentarz został dodany.', 'success')
      loadReviews()
    } catch {
      setFormError('Nie udało się połączyć z serwerem.')
    }
  }

  if (error) {
    return (
      <main className="game-page">
        <p>{error}</p>
      </main>
    )
  }

  if (!game) {
    return (
      <main className="game-page">
        <div className="skeleton skeleton-card" aria-hidden="true"></div>
        <div className="skeleton" style={{ height: 360 }} aria-hidden="true"></div>
      </main>
    )
  }

  const locked = game.isAdult && !ageConfirmed
  const genreList = game.genres || []

  const average =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + Number(r.rating), 0) / reviews.length).toFixed(1)
      : '-'

  return (
    <>
      {locked && (
        <div className="age-gate" role="dialog" aria-modal="true" aria-labelledby="age-gate-title">
          <div className="age-gate-box">
            <h1 id="age-gate-title">Treść 18+</h1>
            <p>Czy masz ukończone 18 lat?</p>
            <div className="age-gate-buttons">
              <button type="button" className="age-gate-yes" onClick={() => setAgeConfirmed(true)}>
                Tak
              </button>
              <button type="button" className="age-gate-no" onClick={() => navigate('/')}>
                Nie
              </button>
            </div>
          </div>
        </div>
      )}

      <main className={locked ? 'game-page blurred' : 'game-page'}>
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
            {game.publisher && (
              <Link className="game-link" to={`/gry?wydawca=${game.publisher.id}`}>
                {game.publisher.name}
              </Link>
            )}
          </div>

          <p className="game-description">{game.description}</p>

          <h2 className="game-subtitle">
            Gatunek:{' '}
            {genreList.length === 0 && 'brak'}
            {genreList.map((genre, index) => (
              <span key={genre.id}>
                {index > 0 && ' / '}
                <Link className="game-link" to={`/gry?gatunek=${genre.id}`}>
                  {genre.name}
                </Link>
              </span>
            ))}
          </h2>

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

              <div className="comment-file">
                <label className="comment-file-button">
                  Dodaj zdjęcie (opcjonalnie)
                  <input
                    key={fileKey}
                    className="comment-file-input"
                    type="file"
                    accept="image/*"
                    onChange={handleImage}
                  />
                </label>
                {imagePreview && (
                  <div className="comment-preview">
                    <img src={imagePreview} alt="Podgląd zdjęcia" />
                    <button type="button" onClick={removeImage}>Usuń</button>
                  </div>
                )}
              </div>

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
                {review.imageUrl && (
                  <a
                    href={review.imageUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="comment-image-link"
                  >
                    <img
                      className="comment-image"
                      src={review.imageUrl}
                      alt="Zdjęcie dodane do komentarza"
                    />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        <ActionPanel appId={id} />

        {similar.length > 0 && (
          <div className="game-similar">
            <GameSection title="Podobne gry" games={similar} columns={6} />
          </div>
        )}
      </main>
    </>
  )
}

export default GamePage