import { Link } from 'react-router-dom'
import GameCard from './GameCard'
import './GameSection.css'

function GameSection({
  title,
  games,
  linkText,
  linkTo = '/gry',
  columns = 5,
  scroll = false,
  loading = false,
  emptyText = 'Brak gier.',
}) {
  const skeletonCount = scroll ? 4 : columns

  return (
    <section className="game-section">
      <div className="game-section-header">
        <h2>{title}</h2>
        {linkText && <Link to={linkTo}>{linkText}</Link>}
      </div>

      {loading ? (
        <div
          className="game-section-row"
          style={{ gridTemplateColumns: `repeat(${skeletonCount}, 1fr)` }}
        >
          {Array.from({ length: skeletonCount }).map((_, index) => (
            <div key={index} className="skeleton skeleton-card" aria-hidden="true"></div>
          ))}
        </div>
      ) : games.length === 0 ? (
        <p style={{ color: 'var(--muted)', fontSize: '14px' }}>{emptyText}</p>
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