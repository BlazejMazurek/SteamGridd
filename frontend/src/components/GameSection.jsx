import GameCard from './GameCard'
import './GameSection.css'
import { Link } from 'react-router-dom'

function GameSection({ title, games, linkText, columns = 5 }) {
  return (
    <section className="game-section">
      <div className="game-section-header">
        <h2>{title}</h2>
        {linkText && <Link to="/gry">{linkText}</Link>}
      </div>
      <div
        className="game-section-row"
        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
      >
        {games.map((game) => (
          <GameCard
            key={game.id}
            id={game.id}
            title={game.title}
            rating={game.rating}
          />
        ))}
      </div>
    </section>
  )
}

export default GameSection