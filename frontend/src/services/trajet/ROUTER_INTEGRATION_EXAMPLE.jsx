// Example Router Integration - Wasalny Frontend
// Add this to your main routing file (App.jsx or router.jsx)

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Pages
import ConfigurationPage from '@/services/trajet/pages/configuration/configuration';
import RechercheTrajetPage from '@/services/trajet/pages/recherche/recherche';

// Layout Components
import AdminLayout from '@/components/layouts/AdminLayout';
import ClientLayout from '@/components/layouts/ClientLayout';

// Auth
import PrivateRoute from '@/components/auth/PrivateRoute';
import RoleBasedRoute from '@/components/auth/RoleBasedRoute';

/**
 * Router Configuration Example
 * 
 * Structure:
 * /admin
 *   /configuration       → Configuration des horaires (ADMIN only)
 * /trajet
 *   /recherche          → Recherche de trajets (PUBLIC)
 */

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        {/* Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <RoleBasedRoute requiredRole="ADMIN">
              <AdminLayout />
            </RoleBasedRoute>
          }
        >
          {/* Configuration Management */}
          <Route path="configuration" element={<ConfigurationPage />} />
          
          {/* Add other admin pages here */}
          {/* <Route path="lignes" element={<LignesPage />} />
              <Route path="stations" element={<StationsPage />} />
              <Route path="buses" element={<BusesPage />} /> */}
        </Route>

        {/* Public Routes */}
        <Route
          path="/trajet/*"
          element={<ClientLayout />}
        >
          {/* Trajet Search */}
          <Route path="recherche" element={<RechercheTrajetPage />} />
          
          {/* Add other public pages here */}
          {/* <Route path="details/:tripId" element={<TripDetailsPage />} /> */}
        </Route>

        {/* Default Route */}
        <Route path="/" element={<Navigate to="/trajet/recherche" replace />} />

        {/* 404 Page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

/**
 * PrivateRoute Component Example:
 * 
 * import { Navigate } from 'react-router-dom';
 * 
 * export default function PrivateRoute({ children }) {
 *   const token = localStorage.getItem('token');
 *   return token ? children : <Navigate to="/login" replace />;
 * }
 */

/**
 * RoleBasedRoute Component Example:
 * 
 * import { Navigate } from 'react-router-dom';
 * 
 * export default function RoleBasedRoute({ children, requiredRole }) {
 *   const token = localStorage.getItem('token');
 *   const userRole = localStorage.getItem('userRole');
 *   
 *   if (!token) return <Navigate to="/login" replace />;
 *   if (userRole !== requiredRole) return <Navigate to="/" replace />;
 *   
 *   return children;
 * }
 */

/**
 * Layout Component Example:
 * 
 * export default function AdminLayout() {
 *   return (
 *     <div className="admin-layout">
 *       <AdminSidebar />
 *       <div className="admin-content">
 *         <AdminHeader />
 *         <main>
 *           <Outlet />
 *         </main>
 *       </div>
 *     </div>
 *   );
 * }
 */
