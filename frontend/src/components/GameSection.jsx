import { Link } from 'react-router-dom'
import GameCard from './GameCard'
import './GameSection.css'

function GameSection({
  title,
  games,
  linkText,
  columns = 5,
  scroll = false,
  emptyText = 'Brak gier.',
}) {
  return (
    <section className="game-section">
      <div className="game-section-header">
        <h2>{title}</h2>
        {linkText && <Link to="/gry">{linkText}</Link>}
      </div>

      {games.length === 0 ? (
        <p style={{ color: '#9aa3d0', fontSize: '14px' }}>{emptyText}</p>
      ) : (
        <div
          className={scroll ? 'game-section-row scroll' : 'game-section-row'}
          style={scroll ? undefined : { gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {games.map((game) => (
            <GameCard
              key={game.id}
              id={game.appId ?? game.id}
              title={game.title}
              image={game.coverImage}
              rating={game.rating}
              badges={game.badges}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default GameSection