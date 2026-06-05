import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

/**
 * AdminRoute — protects routes that require admin role.
 *
 * Usage in App.jsx:
 *   <Route element={<AdminRoute />}>
 *     <Route path="/admin/reviews" element={<AdminReviews />} />
 *   </Route>
 *
 * Checks both authentication AND role === 'admin'.
 * Non-logged-in users → /login
 * Logged-in non-admins → /unauthorized  (or pass `redirectTo` prop)
 */
const AdminRoute = ({ redirectTo = '/unauthorized' }) => {
  const location = useLocation();

  const token = localStorage.getItem('token');
  const user  = (() => {
    try { return JSON.parse(localStorage.getItem('user')); }
    catch { return null; }
  })();

  // Not logged in at all → send to login
  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Logged in but not admin → send to unauthorized page
  if (user.role !== 'admin') {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default AdminRoute;