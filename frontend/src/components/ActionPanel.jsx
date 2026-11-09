import { useState } from 'react'
import './ActionPanel.css'

const actions = [
  { key: 'played', icon: '🎮', label: 'ograne' },
  { key: 'liked', icon: '♥', label: 'polubione' },
  { key: 'platinum', icon: '🏆', label: 'platyna' },
  { key: 'queue', icon: '🕒', label: 'do kolejki' },
]

function ActionPanel() {
  const [active, setActive] = useState({})
  const [rating, setRating] = useState(0)

  function toggle(key) {
    setActive({ ...active, [key]: !active[key] })
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
            className={active[action.key] ? 'action-button on' : 'action-button'}
            onClick={() => toggle(action.key)}
          >
            <span className="action-icon">{action.icon}</span>
            <span>{action.label}</span>
          </button>
        ))}
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
        {rating === 0 ? 'Dodaj ocenę' : `Twoja ocena: ${rating}`}
      </div>
    </aside>
  )
}

export default ActionPanel