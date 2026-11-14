import { useState, useEffect } from 'react'
import { API_URL } from '../api'
import './ActionPanel.css'

const actions = [
  { key: 'isPlayed', icon: '🎮', label: 'ograne', size: 30 },
  { key: 'isLiked', icon: '♥', label: 'polubione', size: 42 },
  { key: 'isCompleted', icon: '🏆', label: 'platyna', size: 30 },
  { key: 'isQueued', icon: '⌛', label: 'do ogrania', size: 30 },
]

function ActionPanel({ appId }) {
  const [status, setStatus] = useState({})
  const [favorite, setFavorite] = useState(false)
  const [rating, setRating] = useState(0)
  const [message, setMessage] = useState('')
  const token = localStorage.getItem('token')

  useEffect(() => {
    if (!token) return
    const headers = { Authorization: `Bearer ${token}` }

    fetch(`${API_URL}/user/me/games/${appId}`, { headers })
      .then((response) => response.json())
      .then((data) => setStatus(data))
      .catch(() => {})

    fetch(`${API_URL}/user/me/favorites/${appId}`, { headers })
      .then((response) => response.json())
      .then((data) => setFavorite(Boolean(data.isFavorite)))
      .catch(() => {})
  }, [appId, token])

  async function toggle(key) {
    if (!token) {
      setMessage('Zaloguj się, aby korzystać z panelu.')
      return
    }
    const newValue = !status[key]
    setStatus({ ...status, [key]: newValue })
    try {
      const response = await fetch(`${API_URL}/user/me/games/${appId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ field: key, value: newValue }),
      })
      if (!response.ok) throw new Error('error')
      setMessage('')
    } catch {
      setStatus({ ...status, [key]: !newValue })
      setMessage('Nie udało się zapisać.')
    }
  }

  async function toggleFavorite() {
    if (!token) {
      setMessage('Zaloguj się, aby korzystać z panelu.')
      return
    }
    const newValue = !favorite
    try {
      const response = await fetch(`${API_URL}/user/me/favorites/${appId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ value: newValue }),
      })
      const data = await response.json()
      if (!response.ok) {
        setMessage(data.error || 'Nie udało się zapisać.')
        return
      }
      setFavorite(newValue)
      setMessage('')
    } catch {
      setMessage('Nie udało się zapisać.')
    }
  }

  function rate(n) {
    setRating(n === rating ? 0 : n)
  }

  return (
    <aside className="action-panel">
      <div className="action-buttons">
        {actions.map((action) => (
          <button
            key={action.key}
            className={status[action.key] ? 'action-button on' : 'action-button'}
            onClick={() => toggle(action.key)}
          >
            <span className="action-icon" style={{ fontSize: action.size }}>
              {action.icon}
            </span>
            <span>{action.label}</span>
          </button>
        ))}

        <button
          className={favorite ? 'action-button action-wide on' : 'action-button action-wide'}
          onClick={toggleFavorite}
        >
          <span className="action-icon" style={{ fontSize: 30 }}>📌</span>
          <span>ulubiona gra</span>
        </button>
      </div>

      <div className="action-stars">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            className={n <= rating ? 'rate-star on' : 'rate-star'}
            onClick={() => rate(n)}
          >
            ★
          </button>
        ))}
      </div>

      <div className="action-label">
        {message || (rating === 0 ? 'Dodaj ocenę' : `Twoja ocena: ${rating}`)}
      </div>
    </aside>
  )
}

export default ActionPanel