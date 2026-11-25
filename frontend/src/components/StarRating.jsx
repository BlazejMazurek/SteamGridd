import './StarRating.css'

function StarRating({ value, size = 20 }) {
  return (
    <span className="stars" style={{ fontSize: size }}>
      <span className="stars-empty">★★★★★</span>
      <span className="stars-full" style={{ width: `${(value / 5) * 100}%` }}>
        ★★★★★
      </span>
    </span>
  )
}

export default StarRating