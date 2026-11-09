import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import HomePage from './pages/HomePage'
import GamePage from './pages/GamePage'
import ProfilePage from './pages/ProfilePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import GamesPage from './pages/GamesPage'
import UsersPage from './pages/UsersPage'

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/gra/:id" element={<GamePage />} />
        <Route path="/profil" element={<ProfilePage />} />
        <Route path="/logowanie" element={<LoginPage />} />
        <Route path="/rejestracja" element={<RegisterPage />} />
        <Route path="/gry" element={<GamesPage />} />
        <Route path="/uzytkownicy" element={<UsersPage />} />
        <Route path="/uzytkownik/:id" element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App