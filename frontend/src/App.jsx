import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import HomePage from './pages/HomePage'
import GamePage from './pages/GamePage'
import GamesPage from './pages/GamesPage'
import ProfilePage from './pages/ProfilePage'
import UsersPage from './pages/UsersPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import SettingsPage from './pages/SettingsPage'

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/gra/:id" element={<GamePage />} />
        <Route path="/gry" element={<GamesPage />} />
        <Route path="/profil" element={<ProfilePage />} />
        <Route path="/uzytkownik/:id" element={<ProfilePage />} />
        <Route path="/uzytkownicy" element={<UsersPage />} />
        <Route path="/logowanie" element={<LoginPage />} />
        <Route path="/rejestracja" element={<RegisterPage />} />
        <Route path="/ustawienia" element={<SettingsPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App