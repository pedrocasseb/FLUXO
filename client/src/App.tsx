import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import CategoriesPage from './pages/CategoriesPage';
import TransactionsPage from './pages/TransactionsPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import RedirectIfAuthenticated from './components/auth/RedirectIfAuthenticated';
import { useReducedMotion } from './hooks/useReducedMotion';
import { EASE_FLUID } from './lib/motion';

export default function App() {
  const location = useLocation();
  const reduced = useReducedMotion();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [location.pathname]);

  return (
    <div
      key={location.pathname}
      style={reduced ? undefined : { animation: `page-enter 0.5s ${EASE_FLUID} both` }}
    >
      <Routes>
        <Route
          path="/"
          element={
            <RedirectIfAuthenticated>
              <LandingPage />
            </RedirectIfAuthenticated>
          }
        />
        <Route path="/entrar" element={<LoginPage />} />
        <Route path="/cadastro" element={<SignupPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/categorias"
          element={
            <ProtectedRoute>
              <CategoriesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/transacoes"
          element={
            <ProtectedRoute>
              <TransactionsPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}
