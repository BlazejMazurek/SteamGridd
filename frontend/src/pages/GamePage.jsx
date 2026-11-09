import { useState } from 'react'
import StarRating from '../components/StarRating'
import ActionPanel from '../components/ActionPanel'
import './GamePage.css'

const game = {
  title: 'Tytuł gry',
  year: 'rok wydania',
  developer: 'producent/wydawca',
  description:
    'Opis gry: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  genre: 'FPS / Multiplayer',
  average: 3.7,
}

const startComments = [
  {
    id: 1,
    user: 'nazwa użytkownika',
    rating: 3,
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  {
    id: 2,
    user: 'inny użytkownik',
    rating: 4.5,
    text: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
  },
]

const ratingOptions = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]

function GamePage() {
  const [comments, setComments] = useState(startComments)
  const [text, setText] = useState('')
  const [rating, setRating] = useState('4')

  function handleSubmit(e) {
    e.preventDefault()
    if (text.trim() === '') return

    const newComment = {
      id: Date.now(),
      user: 'Ty',
      rating: Number(rating),
      text: text.trim(),
    }

    setComments([newComment, ...comments])
    setText('')
  }

  return (
    <main className="game-page">
      <div className="game-cover"></div>

      <div className="game-info">
        <div className="game-title-row">
          <h1>{game.title}</h1>
          <span>{game.year}</span>
          <span>{game.developer}</span>
        </div>

        <p className="game-description">{game.description}</p>

        <h2 className="game-subtitle">Gatunek: {game.genre}</h2>

        <h2 className="game-subtitle">Średnia ocen:</h2>
        <div className="game-average">
          <span>★</span>
          <span>{game.average}</span>
        </div>

        <h2 className="game-comments-title">Dodaj komentarz:</h2>
        <form className="comment-form" onSubmit={handleSubmit}>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Napisz, co sądzisz o tej grze..."
            rows={3}
          />
          <div className="comment-form-row">
            <label>
              Ocena:
              <select value={rating} onChange={(e) => setRating(e.target.value)}>
                {ratingOptions.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
            <button type="submit">Dodaj</button>
          </div>
        </form>

        <h2 className="game-comments-title">Ostatnie komentarze:</h2>
        {comments.map((comment) => (
          <div className="comment" key={comment.id}>
            <div className="comment-avatar"></div>
            <div className="comment-body">
              <div className="comment-head">
                <span>{comment.user}</span>
                <StarRating value={comment.rating} size={16} />
              </div>
              <p>{comment.text}</p>
            </div>
          </div>
        ))}
      </div>

      <ActionPanel />
    </main>
  )
}

export default GamePage