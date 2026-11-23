import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { API_URL } from '../api'
import './Header.css'

function navClass({ isActive }) {
  return isActive ? 'header-link active' : 'header-link'
}

function Header() {
  const location = useLocation()
  const token = localStorage.getItem('token')
  const [avatar, setAvatar] = useState('')

  useEffect(() => {
    if (!token) {
      setAvatar('')
      return
    }
    fetch(`${API_URL}/user/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => setAvatar(data && data.avatarUrl ? data.avatarUrl : ''))
      .catch(() => setAvatar(''))
  }, [token, location.pathname])

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="header-logo">
          Steam<span>Gridd</span>
        </Link>

        <nav className="header-menu">
          {token ? (
            <>
              <NavLink to="/profil" className={navClass}>Konto</NavLink>
              <NavLink to="/ustawienia" className={navClass}>Ustawienia</NavLink>
            </>
          ) : (
            <NavLink to="/logowanie" className={navClass}>Zaloguj</NavLink>
          )}
          <NavLink to="/gry" className={navClass}>Gry</NavLink>
          <NavLink to="/uzytkownicy" className={navClass}>Użytkownicy</NavLink>

          {token && (
            <Link to="/profil" className="header-avatar" aria-label="Mój profil">
              {avatar && <img src={avatar} alt="" />}
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header