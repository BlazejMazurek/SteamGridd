import { Link } from 'react-router-dom'
import StarRating from './StarRating'
import './GameCard.css'

function GameCard({ id, title, rating }) {
  return (
    <div>
      <Link to={`/gra/${id}`} className="game-card">
        <span>{title}</span>
      </Link>
      {rating !== undefined && (
        <div className="game-card-rating">
          <StarRating value={rating} size={18} />
        </div>
      )}
    </div>
  )
}

export default GameCard