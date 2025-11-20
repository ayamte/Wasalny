import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, ChevronDown, LogOut, Settings, User } from 'lucide-react'
import * as authService from '../services/auth/authService'
import './Navbar.css'

export default function Navbar() {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const isAuthenticated = authService.isAuthenticated()
  const user = authService.getUser()

  const toggleMenu = () => setIsOpen(!isOpen)
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen)

  const handleLogout = () => {
    authService.logout()
    navigate('/auth')
  }

  const navLinks = [
    { label: 'Accueil', href: '/trajet/recherche' },
    { label: 'Abonnement', href: '/abonnement' },
    { label: 'Mes Trajets', href: '/mes-trajets' },
  ]

  if (!isAuthenticated) {
    return null
  }

  return (
    <nav className="navbar-container">
      <div className="navbar-wrapper">
        <div className="navbar-content">
          {/* Logo */}
          <Link to="/trajet/recherche" className="navbar-logo">
            <img
              src="/images/logo_partie1.png"
              alt="Wasalny Logo"
              className="navbar-logo-image"
            />
            <div className="navbar-logo-text">
              Wasalny
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="navbar-links-desktop">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="navbar-link"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Section - Profile Dropdown + Mobile Menu */}
          <div className="navbar-right">
            {/* Profile Dropdown */}
            <div className="navbar-profile-container">
              <button
                onClick={toggleProfile}
                className="navbar-profile-button"
              >
                <User size={20} />
                <span className="navbar-profile-name">{user?.username || 'Profil'}</span>
                <ChevronDown
                  size={16}
                  className={`navbar-chevron ${isProfileOpen ? 'open' : ''}`}
                />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileOpen && (
                <div className="navbar-dropdown">
                  <button
                    className="navbar-dropdown-item"
                    onClick={() => {
                      setIsProfileOpen(false)
                      navigate('/profil')
                    }}
                  >
                    <User size={16} />
                    <span className="navbar-dropdown-text">Mon Profil</span>
                  </button>
                  <button
                    className="navbar-dropdown-item"
                    onClick={() => {
                      setIsProfileOpen(false)
                      navigate('/parametres')
                    }}
                  >
                    <Settings size={16} />
                    <span className="navbar-dropdown-text">Paramètres</span>
                  </button>
                  <hr className="navbar-dropdown-divider" />
                  <button
                    className="navbar-dropdown-item logout"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} />
                    <span className="navbar-dropdown-text">Déconnexion</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="navbar-mobile-button"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="navbar-mobile-menu">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="navbar-mobile-link"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}
