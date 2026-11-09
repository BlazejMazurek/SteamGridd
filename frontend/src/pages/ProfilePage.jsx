import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import GameSection from '../components/GameSection'
import RatingsHistogram from '../components/RatingsHistogram'
import { API_URL } from '../api'
import './ProfilePage.css'

function ProfilePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState('Ładowanie...')

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (!id && !token) {
      setMessage('login')
      return
    }

    const url = id ? `${API_URL}/user/${id}` : `${API_URL}/user/me`
    const options = id ? {} : { headers: { Authorization: `Bearer ${token}` } }

    fetch(url, options)
      .then((response) => {
        if (!response.ok) throw new Error('error')
        return response.json()
      })
      .then((data) => setUser(data))
      .catch(() => setMessage(id ? 'Nie znaleziono użytkownika.' : 'login'))
  }, [id])

  function handleLogout() {
    localStorage.removeItem('token')
    navigate('/')
  }

  if (!user) {
    return (
      <main className="profile-page">
        {message === 'login' ? (
          <p>
            Zaloguj się, aby zobaczyć profil. <Link to="/logowanie">Przejdź do logowania</Link>
          </p>
        ) : (
          <p>{message}</p>
        )}
      </main>
    )
  }

  const favoriteGames = user.favoriteGames.map((game) => ({
    id: game.appId,
    appId: game.appId,
    title: game.title,
    coverImage: game.coverImage,
  }))

  const recentGames = user.reviews.slice(0, 4).map((review) => ({
    id: review.game.appId,
    appId: review.game.appId,
    title: review.game.title,
    coverImage: review.game.coverImage,
    rating: Number(review.rating),
  }))

  const ratingCounts = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map((value) => ({
    value,
    count: user.reviews.filter((review) => Number(review.rating) === value).length,
  }))

  return (
    <main className="profile-page">
      <div className="profile-main">
        <div className="profile-header">
          <div className="profile-avatar"></div>
          <div>
            <h1>{user.username}</h1>
            <p>ulubiony gatunek: {user.favoriteGenre ? user.favoriteGenre.name : 'brak'}</p>
          </div>
          {!id && (
            <button className="logout-button" onClick={handleLogout}>
              Wyloguj
            </button>
          )}
        </div>

        <GameSection title="Ulubione gry" games={favoriteGames} columns={4} />
        <GameSection
          title="Ostatnio ograne gry"
          games={recentGames}
          linkText="zobacz wszystkie"
          columns={4}
        />
      </div>

      <RatingsHistogram counts={ratingCounts} />
    </main>
  )
}

export default ProfilePage