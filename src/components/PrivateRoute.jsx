import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

/**
 * PrivateRoute — protects routes that require a logged-in user.
 *
 * Usage in App.jsx:
 *   <Route element={<PrivateRoute />}>
 *     <Route path="/dashboard" element={<Dashboard />} />
 *   </Route>
 *
 * Reads auth state from localStorage (token + user JSON).
 * Redirects to /login and preserves the attempted URL via `state.from`.
 */
const PrivateRoute = ({ redirectTo = '/login' }) => {
  const location = useLocation();

  const token = localStorage.getItem('token');
  const user  = (() => {
    try { return JSON.parse(localStorage.getItem('user')); }
    catch { return null; }
  })();

  const isAuthenticated = Boolean(token && user);

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;