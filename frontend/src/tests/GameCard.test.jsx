import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import GameCard from '../components/GameCard'

function renderCard(props) {
  return render(
    <MemoryRouter>
      <GameCard {...props} />
    </MemoryRouter>
  )
}

describe('GameCard', () => {
  it('prowadzi do strony gry', () => {
    renderCard({ id: 730, title: 'Counter-Strike 2', image: 'cs.jpg' })
    expect(screen.getByRole('link')).toHaveAttribute('href', '/gra/730')
  })

  it('pokazuje okładkę z nazwą gry w alt', () => {
    renderCard({ id: 1, title: 'Portal', image: 'portal.jpg' })
    expect(screen.getByAltText('Portal')).toHaveAttribute('src', 'portal.jpg')
  })

  it('pokazuje tytuł, gdy gra nie ma okładki', () => {
    renderCard({ id: 2, title: 'Gra bez okładki' })
    expect(screen.getByText('Gra bez okładki')).toBeInTheDocument()
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('nie pokazuje gwiazdek, gdy nie ma oceny', () => {
    const { container } = renderCard({ id: 3, title: 'Bez oceny', image: 'a.jpg' })
    expect(container.querySelector('.game-card-rating')).toBeNull()
  })

  it('pokazuje gwiazdki, gdy jest ocena', () => {
    const { container } = renderCard({ id: 4, title: 'Z oceną', image: 'a.jpg', rating: 4 })
    expect(container.querySelector('.game-card-rating')).not.toBeNull()
  })

  it('pokazuje odznaki, gdy są podane', () => {
    renderCard({
      id: 5,
      title: 'Z odznaką',
      image: 'a.jpg',
      badges: [{ key: 'liked', label: 'polubione', icon: '♥' }],
    })
    expect(screen.getByTitle('polubione')).toBeInTheDocument()
  })
})
