import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ThemeProvider, useTheme } from '../context/ThemeContext'

function Demo() {
  const { theme, toggleTheme } = useTheme()
  return <button onClick={toggleTheme}>motyw: {theme}</button>
}

function renderDemo() {
  return render(
    <ThemeProvider>
      <Demo />
    </ThemeProvider>
  )
}

describe('ThemeContext', () => {
  it('domyślnie używa ciemnego motywu', () => {
    renderDemo()
    expect(screen.getByRole('button')).toHaveTextContent('motyw: dark')
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  })

  it('przełącza motyw i zapisuje go w localStorage', () => {
    renderDemo()
    fireEvent.click(screen.getByRole('button'))
    expect(screen.getByRole('button')).toHaveTextContent('motyw: light')
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
    expect(localStorage.getItem('theme')).toBe('light')
  })

  it('startuje z zapisanym jasnym motywem', () => {
    localStorage.setItem('theme', 'light')
    renderDemo()
    expect(screen.getByRole('button')).toHaveTextContent('motyw: light')
  })
})
