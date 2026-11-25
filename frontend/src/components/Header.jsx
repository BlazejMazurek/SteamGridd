import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import './Header.css'

function navClass({ isActive }) {
  return isActive ? 'header-link active' : 'header-link'
}

function Header() {
  const location = useLocation()
  const { isLoggedIn, currentUser } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="header-logo">
          Steam<span>Gridd</span>
        </Link>

        <button
          type="button"
          className="header-burger"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={open ? 'header-menu open' : 'header-menu'}>
          {isLoggedIn ? (
            <>
              <NavLink to="/profil" className={navClass}>Konto</NavLink>
              <NavLink to="/ustawienia" className={navClass}>Ustawienia</NavLink>
            </>
          ) : (
            <NavLink to="/logowanie" className={navClass}>Zaloguj</NavLink>
          )}
          <NavLink to="/gry" className={navClass}>Gry</NavLink>
          <NavLink to="/uzytkownicy" className={navClass}>Użytkownicy</NavLink>

          <button
            type="button"
            className="header-theme"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Włącz jasny motyw' : 'Włącz ciemny motyw'}
            title={theme === 'dark' ? 'Jasny motyw' : 'Ciemny motyw'}
          >
            {theme === 'dark' ? (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
              </svg>
            ) : (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
              </svg>
            )}
          </button>

          {isLoggedIn && (
            <Link to="/profil" className="header-avatar" aria-label="Mój profil">
              {currentUser && currentUser.avatarUrl && <img src={currentUser.avatarUrl} alt="" />}
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header