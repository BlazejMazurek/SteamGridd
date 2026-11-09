import { Link } from 'react-router-dom'
import './Header.css'

function Header() {
  return (
    <header className="header">
      <Link to="/" className="header-logo">Nazwa Robocza</Link>
      <nav className="header-menu">
        <Link to="/profil">Konto</Link>
        <Link to="/logowanie">Zaloguj</Link>
        <Link to="/gry">Gry</Link>
        <Link to="/uzytkownicy">Użytkownicy</Link>
        <Link to="/gry">Wyszukaj</Link>
      </nav>
    </header>
  )
}

export default Header