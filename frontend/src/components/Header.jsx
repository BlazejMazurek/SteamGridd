import { Link, useLocation } from 'react-router-dom'
import './Header.css'

function Header() {
  useLocation()
  const loggedIn = Boolean(localStorage.getItem('token'))

  return (
    <header className="header">
      <Link to="/" className="header-logo">Nazwa Robocza</Link>
      <nav className="header-menu">
        {loggedIn ? (
          <Link to="/profil">Konto</Link>
        ) : (
          <Link to="/logowanie">Zaloguj</Link>
        )}
        <Link to="/gry">Gry</Link>
        <Link to="/uzytkownicy">Użytkownicy</Link>
      </nav>
    </header>
  )
}

export default Header