import { Link } from 'react-router-dom'
import StarRating from './StarRating'
import './GameCard.css'

function GameCard({ id, title, image, rating, badges }) {
  const hasBadges = badges && badges.length > 0

  return (
    <div className="game-card-wrap">
      <Link to={`/gra/${id}`} className="game-card" title={title}>
        {image ? <img src={image} alt={title} /> : <span>{title}</span>}
      </Link>

      {hasBadges && (
        <div className="game-card-badges">
          {badges.map((badge) => (
            <span className="game-card-badge" key={badge.key} title={badge.label}>
              <span className="game-card-badge-icon">{badge.icon}</span>
            </span>
          ))}
        </div>
      )}

      {rating !== undefined && (
        <div className="game-card-rating">
          <StarRating value={rating} size={16} />
        </div>
      )}
    </div>
  )
}

export default GameCard