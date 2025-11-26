import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  MapPin,
  Clock,
  LogOut,
  Menu,
  X,
  Bus
} from 'lucide-react'
import './DriverLayout.css'

const DriverLayout = ({ children }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const menuItems = [
    { path: '/conducteur/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/conducteur/mes-trajets', icon: MapPin, label: 'Mes Trajets' },
  ]

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/auth')
  }

  return (
    <div className="driver-layout-container">
      {/* Sidebar */}
      <aside className={`driver-layout-sidebar ${isSidebarOpen ? 'driver-sidebar-open' : 'driver-sidebar-closed'}`}>
        <div className="driver-sidebar-header">
          <div className="driver-logo-container">
            <Bus className="driver-logo-icon" />
            <h1 className={`driver-logo-text ${!isSidebarOpen ? 'driver-hidden' : ''}`}>Wasalny Driver</h1>
          </div>
          <button
            className="driver-toggle-btn"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="driver-sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`driver-nav-item ${isActive ? 'driver-nav-active' : ''}`}
              >
                <Icon size={20} />
                <span className={`driver-nav-label ${!isSidebarOpen ? 'driver-hidden' : ''}`}>
                  {item.label}
                </span>
              </Link>
            )
          })}
        </nav>

        <div className="driver-sidebar-footer">
          <button className="driver-logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            <span className={`driver-nav-label ${!isSidebarOpen ? 'driver-hidden' : ''}`}>
              Déconnexion
            </span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`driver-layout-main ${isSidebarOpen ? 'driver-main-sidebar-open' : 'driver-main-sidebar-closed'}`}>
        {children}
      </main>
    </div>
  )
}

export default DriverLayout
