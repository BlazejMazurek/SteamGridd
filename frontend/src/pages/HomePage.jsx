import GameSection from '../components/GameSection'

const newGames = [
  { id: 1, title: 'Gra 1' },
  { id: 2, title: 'Gra 2' },
  { id: 3, title: 'Gra 3' },
  { id: 4, title: 'Gra 4' },
  { id: 5, title: 'Gra 5' },
]

const popularGames = [
  { id: 6, title: 'Gra 6' },
  { id: 7, title: 'Gra 7' },
  { id: 8, title: 'Gra 8' },
  { id: 9, title: 'Gra 9' },
  { id: 10, title: 'Gra 10' },
]

function HomePage() {
  return (
    <main style={{ maxWidth: '1000px', margin: '60px auto', padding: '0 20px' }}>
      <GameSection title="nowo dodane gry" games={newGames} linkText="Zobacz więcej" />
      <GameSection title="najpopularniejsze gry w tym tygodniu" games={popularGames} linkText="Zobacz więcej" />
    </main>
  )
}

export default HomePage