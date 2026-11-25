import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import RatingsHistogram from '../components/RatingsHistogram'

describe('RatingsHistogram', () => {
  const counts = [
    { value: 1, count: 2 },
    { value: 2, count: 4 },
    { value: 3, count: 1 },
  ]

  it('rysuje słupek dla każdej oceny', () => {
    const { container } = render(<RatingsHistogram counts={counts} />)
    expect(container.querySelectorAll('.histogram-bar')).toHaveLength(3)
  })

  it('najwyższy słupek ma 80px, a połowa tego ma 40px', () => {
    const { container } = render(<RatingsHistogram counts={counts} />)
    const bars = container.querySelectorAll('.histogram-bar')
    expect(bars[1].style.height).toBe('80px')
    expect(bars[0].style.height).toBe('40px')
  })
})
