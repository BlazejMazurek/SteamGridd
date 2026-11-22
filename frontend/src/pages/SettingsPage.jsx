import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { API_URL } from '../api'
import './SettingsPage.css'

function SettingsPage() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const [loaded, setLoaded] = useState(false)
  const [username, setUsername] = useState('')
  const [genreId, setGenreId] = useState('')
  const [genres, setGenres] = useState([])
  const [avatarUrl, setAvatarUrl] = useState('')
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [remember18, setRemember18] = useState(
    localStorage.getItem('ageConfirmed') === 'yes'
  )
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!token) return

    fetch(`${API_URL}/user/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        if (!response.ok) throw new Error('error')
        return response.json()
      })
      .then((data) => {
        setUsername(data.username || '')
        setGenreId(data.favoriteGenre ? String(data.favoriteGenre.id) : '')
        setAvatarUrl(data.avatarUrl || '')
        setLoaded(true)
      })
      .catch(() => setError('Nie udało się pobrać danych konta.'))

    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setGenres(data)
          return
        }
        throw new Error('no genres')
      })
      .catch(() => {
        fetch(`${API_URL}/games`)
          .then((response) => response.json())
          .then((games) => {
            const map = {}
            games.forEach((game) => {
              ;(game.genres || []).forEach((genre) => {
                map[genre.id] = genre.name
              })
            })
            setGenres(
              Object.entries(map)
                .map(([id, name]) => ({ id: Number(id), name }))
                .sort((a, b) => a.name.localeCompare(b.name))
            )
          })
          .catch(() => {})
      })
  }, [token])

  function handleFile(e) {
    const chosen = e.target.files[0]
    if (!chosen) return

    if (!chosen.type.startsWith('image/')) {
      setError('Wybierz plik graficzny (JPG lub PNG).')
      return
    }
    if (chosen.size > 5 * 1024 * 1024) {
      setError('Zdjęcie jest za duże (maksymalnie 5 MB).')
      return
    }

    setError('')
    setFile(chosen)
    setPreview(URL.createObjectURL(chosen))
  }

  async function handleSave(e) {
    e.preventDefault()
    setMessage('')
    setError('')

    if (username.trim() === '') {
      setError('Nazwa użytkownika nie może być pusta.')
      return
    }

    const formData = new FormData()
    formData.append('username', username.trim())
    formData.append('favoriteGenreId', genreId)
    if (file) formData.append('avatar', file)

    setSaving(true)
    try {
      const response = await fetch(`${API_URL}/user/me`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })
      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Nie udało się zapisać zmian.')
        setSaving(false)
        return
      }

      if (remember18) localStorage.setItem('ageConfirmed', 'yes')
      else localStorage.removeItem('ageConfirmed')

      if (data.user && data.user.avatarUrl) setAvatarUrl(data.user.avatarUrl)
      setFile(null)
      setPreview('')
      setMessage('Zapisano zmiany.')
    } catch {
      setError('Nie udało się połączyć z serwerem.')
    }
    setSaving(false)
  }

  function handleLogout() {
    localStorage.removeItem('token')
    navigate('/')
  }

  if (!token) {
    return (
      <main className="settings-page">
        <p>
          Zaloguj się, aby zmienić ustawienia. <Link to="/logowanie">Przejdź do logowania</Link>
        </p>
      </main>
    )
  }

  if (!loaded && !error) {
    return (
      <main className="settings-page">
        <p>Ładowanie...</p>
      </main>
    )
  }

  const shownAvatar = preview || avatarUrl

  return (
    <main className="settings-page">
      <h1>Ustawienia</h1>

      <form onSubmit={handleSave}>
        <div className="settings-avatar-row">
          <div className="settings-avatar">
            {shownAvatar && <img src={shownAvatar} alt="Zdjęcie profilowe" />}
          </div>
          <div>
            <div className="settings-label">Zdjęcie profilowe</div>
            <label className="settings-file-button">
              Wybierz zdjęcie
              <input
                className="settings-file-input"
                type="file"
                accept="image/*"
                onChange={handleFile}
              />
            </label>
            <div className="settings-hint">JPG lub PNG, maksymalnie 5 MB</div>
          </div>
        </div>

        <div className="settings-fields">
          <label className="settings-field">
            Nazwa użytkownika
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>

          <label className="settings-field">
            Ulubiony gatunek
            <select value={genreId} onChange={(e) => setGenreId(e.target.value)}>
              <option value="">Brak</option>
              {genres.map((genre) => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="settings-toggle-row">
          <div>
            <div className="settings-toggle-title">Treści 18+</div>
            <div className="settings-hint">
              Zapamiętaj potwierdzenie wieku na tym urządzeniu
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={remember18}
            aria-label="Zapamiętaj potwierdzenie wieku"
            className={remember18 ? 'settings-switch on' : 'settings-switch'}
            onClick={() => setRemember18(!remember18)}
          >
            <span className="settings-switch-knob"></span>
          </button>
        </div>

        {error && <div className="auth-error">{error}</div>}
        {message && <div className="settings-ok">{message}</div>}

        <div className="settings-buttons">
          <button type="submit" className="settings-save" disabled={saving}>
            {saving ? 'Zapisywanie...' : 'Zapisz zmiany'}
          </button>
          <button type="button" className="settings-logout" onClick={handleLogout}>
            Wyloguj
          </button>
        </div>
      </form>
    </main>
  )
}

export default SettingsPage