import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Clock,
  MapPin,
  Route,
  Users,
  Bus,
  UserCheck,
  CreditCard,
  LogOut,
  Menu,
  X
} from 'lucide-react'
import './AdminLayout.css'

const AdminLayout = ({ children }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const menuItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/configuration', icon: Clock, label: 'Configuration Horaire' },
    { path: '/admin/stations', icon: MapPin, label: 'Gestion Stations' },
    { path: '/admin/lignes', icon: Route, label: 'Gestion Lignes' },
    { path: '/admin/conducteurs', icon: UserCheck, label: 'Gestion Conducteurs' },
    { path: '/admin/bus', icon: Bus, label: 'Gestion Bus' },
    { path: '/admin/clients', icon: Users, label: 'Gestion Clients' },
    { path: '/admin/abonnements', icon: CreditCard, label: 'Gestion Abonnements' },
  ]

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/auth')
  }

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="logo-container">
            <Bus className="logo-icon" />
            <h1 className={`logo-text ${!isSidebarOpen ? 'hidden' : ''}`}>Wasalny Admin</h1>
          </div>
          <button
            className="toggle-sidebar-btn"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon size={20} />
                <span className={`nav-label ${!isSidebarOpen ? 'hidden' : ''}`}>
                  {item.label}
                </span>
              </Link>
            )
          })}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            <span className={`nav-label ${!isSidebarOpen ? 'hidden' : ''}`}>
              Déconnexion
            </span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`admin-main ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        {children}
      </main>
    </div>
  )
}

export default AdminLayout
