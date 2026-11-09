import { Link } from 'react-router-dom'
import StarRating from './StarRating'
import './GameCard.css'

function GameCard({ id, title, image, rating }) {
  return (
    <div>
      <Link to={`/gra/${id}`} className="game-card" title={title}>
        {image ? <img src={image} alt={title} /> : <span>{title}</span>}
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