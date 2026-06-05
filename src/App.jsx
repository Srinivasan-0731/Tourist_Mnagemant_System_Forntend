import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

// User Pages
const Home              = lazy(() => import('./pages/Home'));
const Login             = lazy(() => import('./pages/Login'));
const Register          = lazy(() => import('./pages/Register'));
const Destinations      = lazy(() => import('./pages/Destinations'));
const DestinationDetail = lazy(() => import('./pages/DestinationDetail'));
const Packages          = lazy(() => import('./pages/Packages'));
const PackageDetail     = lazy(() => import('./pages/PackageDetail'));
const BookingPage       = lazy(() => import('./pages/BookingPage'));
const MyBookings        = lazy(() => import('./pages/MyBookings'));
const Profile           = lazy(() => import('./pages/Profile'));

// Admin Pages
const AdminDashboard    = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminDestinations = lazy(() => import('./pages/admin/AdminDestinations'));
const AdminPackages     = lazy(() => import('./pages/admin/AdminPackages'));
const AdminBookings     = lazy(() => import('./pages/admin/AdminBookings'));
const AdminUsers        = lazy(() => import('./pages/admin/AdminUsers'));
const AdminReviews      = lazy(() => import('./pages/admin/AdminReviews'));

const PageLoader = () => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    minHeight: '100vh', background: '#f4f6fa'
  }}>
    <div style={{
      width: '50px', height: '50px',
      border: '5px solid #f0f0f0',
      borderTop: '5px solid #e94560',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }} />
    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
  </div>
);

const App = () => (
  <AuthProvider>
    <Router>
      <Suspense fallback={<PageLoader />}>
        <Routes>

          {/* ── Public Routes ── */}
          <Route path="/"                    element={<Home />} />
          <Route path="/login"               element={<Login />} />
          <Route path="/register"            element={<Register />} />
          <Route path="/destinations"        element={<Destinations />} />
          <Route path="/destinations/:id"    element={<DestinationDetail />} />
          <Route path="/packages"            element={<Packages />} />
          <Route path="/packages/:id"        element={<PackageDetail />} />

          {/* ── User Protected Routes ── */}
          <Route element={<PrivateRoute />}>
            <Route path="/booking/:packageId" element={<BookingPage />} />
            <Route path="/my-bookings"        element={<MyBookings />} />
            <Route path="/profile"            element={<Profile />} />
          </Route>

          {/* ── Admin Protected Routes ── */}
          <Route element={<AdminRoute />}>
            <Route path="/admin"               element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/dashboard"     element={<AdminDashboard />} />
            <Route path="/admin/destinations"  element={<AdminDestinations />} />
            <Route path="/admin/packages"      element={<AdminPackages />} />
            <Route path="/admin/bookings"      element={<AdminBookings />} />
            <Route path="/admin/users"         element={<AdminUsers />} />
            <Route path="/admin/reviews"       element={<AdminReviews />} />
          </Route>

          {/* ── 404 ── */}
          <Route path="*" element={
            <div style={{ textAlign: 'center', padding: '100px 20px' }}>
              <h1 style={{ fontSize: '80px', color: '#e94560', margin: 0 }}>404</h1>
              <h2 style={{ color: '#1a1a2e' }}>Page Not Found</h2>
              <p style={{ color: '#888' }}>The page you're looking for doesn't exist.</p>
              <a href="/" style={{
                display: 'inline-block', marginTop: '20px',
                background: '#e94560', color: '#fff', padding: '12px 30px',
                borderRadius: '25px', textDecoration: 'none', fontWeight: 'bold'
              }}>Go Home</a>
            </div>
          } />

        </Routes>
      </Suspense>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastStyle={{
          borderRadius: '10px',
          fontSize: '13px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
        }}
      />
    </Router>
  </AuthProvider>
);

export default App;