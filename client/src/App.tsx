import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
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
        <Route path="/" element={<LandingPage />} />
        <Route path="/entrar" element={<LoginPage />} />
        <Route path="/cadastro" element={<SignupPage />} />
      </Routes>
    </div>
  );
}
