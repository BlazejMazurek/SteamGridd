import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { API_URL } from '../api'
import './SettingsPage.css'

function SettingsPage() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const [user, setUser] = useState(null)
  const [queueCount, setQueueCount] = useState(0)
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
        setUser(data)
        setUsername(data.username || '')
        setGenreId(data.favoriteGenre ? String(data.favoriteGenre.id) : '')
        setAvatarUrl(data.avatarUrl || '')

        fetch(`${API_URL}/user/${data.id}/games/queued`)
          .then((response) => response.json())
          .then((list) => setQueueCount(Array.isArray(list) ? list.length : 0))
          .catch(() => {})
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

      if (data.user) {
        if (data.user.avatarUrl) setAvatarUrl(data.user.avatarUrl)
        setUser({ ...user, username: data.user.username })
      }
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

  if (!user && !error) {
    return (
      <main className="settings-page">
        <p>Ładowanie...</p>
      </main>
    )
  }

  const shownAvatar = preview || avatarUrl
  const commentsCount = user ? user.reviews.filter((review) => review.comment).length : 0
  const memberSince =
    user && user.createdAt ? new Date(user.createdAt).toLocaleDateString('pl-PL') : ''

  return (
    <main className="settings-page">
      <aside className="settings-side">
        <div className="settings-card settings-profile">
          <div className="settings-side-avatar">
            {shownAvatar && <img src={shownAvatar} alt="" />}
          </div>
          <div className="settings-side-name">{user ? user.username : ''}</div>
          {memberSince && <div className="settings-side-since">od {memberSince}</div>}

          <div className="settings-stats">
            <div>
              <div className="settings-stat-number">{user ? user.reviews.length : 0}</div>
              <div className="settings-stat-label">oceny</div>
            </div>
            <div>
              <div className="settings-stat-number">{queueCount}</div>
              <div className="settings-stat-label">do ogrania</div>
            </div>
            <div>
              <div className="settings-stat-number">{commentsCount}</div>
              <div className="settings-stat-label">komentarze</div>
            </div>
          </div>

          <nav className="settings-nav">
            <a href="#profil" className="settings-nav-item active">Profil</a>
            <a href="#tresci" className="settings-nav-item">Treści 18+</a>
            <button type="button" className="settings-nav-item danger" onClick={handleLogout}>
              Wyloguj
            </button>
          </nav>
        </div>
      </aside>

      <form className="settings-card settings-main" onSubmit={handleSave}>
        <section id="profil">
          <h1>Profil</h1>
          <p className="settings-sub">Te dane widzą inni użytkownicy.</p>

          <div className="settings-avatar-row">
            <div className="settings-avatar">
              {shownAvatar && <img src={shownAvatar} alt="Zdjęcie profilowe" />}
            </div>
            <div>
              <div className="settings-label">Zdjęcie profilowe</div>
              <div className="settings-hint">JPG lub PNG, maksymalnie 5 MB</div>
              <label className="settings-file-button">
                Zmień zdjęcie
                <input
                  className="settings-file-input"
                  type="file"
                  accept="image/*"
                  onChange={handleFile}
                />
              </label>
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
        </section>

        <section id="tresci">
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
        </section>

        <div className="settings-footer">
          <div className="settings-messages">
            {error && <span className="settings-error">{error}</span>}
            {message && <span className="settings-ok">{message}</span>}
          </div>
          <button type="submit" className="settings-save" disabled={saving}>
            {saving ? 'Zapisywanie...' : 'Zapisz zmiany'}
          </button>
        </div>
      </form>
    </main>
  )
}

export default SettingsPage