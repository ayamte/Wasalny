import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom'
import ConfigurationPage from './services/trajet/pages/configuration/configuration'
import { SearchTripsPage, TripsPage } from './services/trajet/pages/recherche/recherche'
import LinesPage from './services/trajet/pages/lignes/lignes'
import StationsPage from './services/trajet/pages/stations/stations'
import AuthPage from './services/auth/auth'
import ProfilePage from './services/user/profile'
import AdminDashboard from './commun/admin/AdminDashboard'
import ClientsManagement from './services/user/gestion_client/ClientsManagement'
import DriversManagement from './services/user/gestion_conducteur/DriversManagement'
import BusesManagement from './services/trajet/pages/gestion_bus/BusesManagement'
import AdminLayout from './components/admin/AdminLayout'
import * as authService from './services/auth/authService'

// Protected Route Component
function ProtectedRoute({ children, adminOnly = false }) {
  const isAuthenticated = authService.isAuthenticated()
  const user = authService.getUser()

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />
  }

  if (adminOnly && user?.role !== 'ADMIN') {
    return <Navigate to="/trajet/recherche" replace />
  }

  return children
}

function HomePage() {
  const isAuth = authService.isAuthenticated()
  const user = authService.getUser()
  const navigate = React.useRef(null)

  // Redirect admin users to dashboard
  React.useEffect(() => {
    if (isAuth && user?.role === 'ADMIN') {
      navigate.current = setTimeout(() => {
        window.location.href = '/admin/dashboard'
      }, 0)
    }
    return () => {
      if (navigate.current) clearTimeout(navigate.current)
    }
  }, [isAuth, user])

  // Don't render if admin user
  if (isAuth && user?.role === 'ADMIN') {
    return null
  }

  return (
    <div className="text-center py-12">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">
        🚌 Wasalny
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        Plateforme de Gestion de Transport en Commun
      </p>

      {/* Auth Buttons */}
      {!isAuth && (
        <div className="flex justify-center gap-4 mb-8">
          <Link 
            to="/auth"
            className="px-6 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 transition"
          >
            Login
          </Link>
          <Link 
            to="/auth"
            className="px-6 py-2 border-2 border-blue-600 text-blue-600 rounded font-medium hover:bg-blue-50 transition"
          >
            Sign up
          </Link>
        </div>
      )}

      {/* User Info */}
      {isAuth && (
        <div className="mb-8 p-4 bg-green-50 border-2 border-green-200 rounded-lg inline-block">
          <p className="text-green-800">Welcome, <span className="font-bold">{user?.username}</span>! 👋</p>
          <button 
            onClick={() => authService.logout()}
            className="mt-2 px-4 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <Link 
          to={isAuth ? "/admin/configuration" : "/auth"}
          className="p-6 bg-blue-50 border-2 border-blue-200 rounded-lg hover:shadow-lg transition"
        >
          <h2 className="text-xl font-bold text-blue-600 mb-2">
            ⚙️ Configuration Horaire
          </h2>
          <p className="text-gray-600">
            Gérer les horaires des trajets
          </p>
        </Link>
        <Link 
          to={isAuth ? "/admin/lignes" : "/auth"}
          className="p-6 bg-orange-50 border-2 border-orange-200 rounded-lg hover:shadow-lg transition"
        >
          <h2 className="text-xl font-bold text-orange-600 mb-2">
            🛣️ Gestion Lignes
          </h2>
          <p className="text-gray-600">
            Ajouter et modifier les lignes
          </p>
        </Link>
        <Link 
          to={isAuth ? "/admin/stations" : "/auth"}
          className="p-6 bg-green-50 border-2 border-green-200 rounded-lg hover:shadow-lg transition"
        >
          <h2 className="text-xl font-bold text-green-600 mb-2">
            📍 Gestion Stations
          </h2>
          <p className="text-gray-600">
            Ajouter et modifier les stations
          </p>
        </Link>
        <Link 
          to="/trajet/recherche"
          className="p-6 bg-purple-50 border-2 border-purple-200 rounded-lg hover:shadow-lg transition"
        >
          <h2 className="text-xl font-bold text-purple-600 mb-2">
            🔍 Recherche Trajets
          </h2>
          <p className="text-gray-600">
            Chercher et réserver des trajets
          </p>
        </Link>
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Home page */}
        <Route path="/" element={<HomePage />} />
        
        {/* Auth routes */}
        <Route path="/auth" element={<AuthPage />} />

        {/* Admin routes - Protected */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/horaires"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminLayout>
                <ConfigurationPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/configuration"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminLayout>
                <ConfigurationPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* Lines and Stations Management - Protected */}
        <Route
          path="/admin/lignes"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminLayout>
                <LinesPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/stations"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminLayout>
                <StationsPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/conducteurs"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminLayout>
                <DriversManagement />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/bus"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminLayout>
                <BusesManagement />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/clients"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminLayout>
                <ClientsManagement />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/abonnements"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminLayout>
                <div className="admin-page">
                  <h2>Gestion Abonnements</h2>
                  <p>Page en cours de développement...</p>
                </div>
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        
        {/* Trip Search routes - Main landing page after login */}
        <Route
          path="/trajet/recherche"
          element={
            <ProtectedRoute>
              <SearchTripsPage />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/trips" 
          element={
            <TripsPage />
          } 
        />

        {/* Profile Page - Protected */}
        <Route
          path="/profil"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Redirect unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
