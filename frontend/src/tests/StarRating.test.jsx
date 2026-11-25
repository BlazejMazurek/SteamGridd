import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import StarRating from '../components/StarRating'

describe('StarRating', () => {
  it('wypełnia 70% gwiazdek dla oceny 3.5', () => {
    const { container } = render(<StarRating value={3.5} />)
    expect(container.querySelector('.stars-full').style.width).toBe('70%')
  })

  it('wypełnia wszystkie gwiazdki dla oceny 5', () => {
    const { container } = render(<StarRating value={5} />)
    expect(container.querySelector('.stars-full').style.width).toBe('100%')
  })

  it('nie wypełnia gwiazdek dla oceny 0', () => {
    const { container } = render(<StarRating value={0} />)
    expect(container.querySelector('.stars-full').style.width).toBe('0%')
  })

  it('używa podanego rozmiaru', () => {
    const { container } = render(<StarRating value={2} size={30} />)
    expect(container.querySelector('.stars').style.fontSize).toBe('30px')
  })
})
