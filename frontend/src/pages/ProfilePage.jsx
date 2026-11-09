import GameSection from '../components/GameSection'
import RatingsHistogram from '../components/RatingsHistogram'
import './ProfilePage.css'

const user = {
  name: 'Nazwa użytkownika',
  favoriteGenre: 'np FPS',
}

const favoriteGames = [
  { id: 1, title: 'Gra 1' },
  { id: 2, title: 'Gra 2' },
  { id: 3, title: 'Gra 3' },
  { id: 4, title: 'Gra 4' },
]

const recentGames = [
  { id: 5, title: 'Gra 5', rating: 4.5 },
  { id: 6, title: 'Gra 6', rating: 3 },
  { id: 7, title: 'Gra 7', rating: 4 },
  { id: 8, title: 'Gra 8', rating: 2 },
]

const ratingCounts = [
  { value: 0.5, count: 1 },
  { value: 1, count: 4 },
  { value: 1.5, count: 10 },
  { value: 2, count: 15 },
  { value: 2.5, count: 7 },
  { value: 3, count: 26 },
  { value: 3.5, count: 20 },
  { value: 4, count: 13 },
  { value: 4.5, count: 17 },
  { value: 5, count: 4 },
]

function ProfilePage() {
  return (
    <main className="profile-page">
      <div className="profile-main">
        <div className="profile-header">
          <div className="profile-avatar"></div>
          <div>
            <h1>{user.name}</h1>
            <p>ulubiony gatunek: {user.favoriteGenre}</p>
          </div>
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