import { Link } from 'react-router-dom'
import './NotFoundPage.css'

function NotFoundPage() {
  return (
    <main className="notfound">
      <div className="notfound-code">404</div>
      <h1>Nie znaleziono strony</h1>
      <p>Adres, który wpisałeś, nie istnieje albo strona została przeniesiona.</p>
      <div className="notfound-buttons">
        <Link to="/" className="notfound-primary">Strona główna</Link>
        <Link to="/gry" className="notfound-secondary">Przeglądaj gry</Link>
      </div>
    </main>
  )
}

export default NotFoundPage