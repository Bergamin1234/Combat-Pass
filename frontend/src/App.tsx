import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import PortalAluno from './pages/PortalAluno';
import AdminDashboard from './pages/AdminDashboard';
import Checkout from './pages/Checkout';
import AgendarAula from './pages/AgendarAula';
import FighterProfile from './pages/FighterProfile';
import LandingHubPage from './pages/LandingHubPage';
import TeacherPortalPage from './pages/TeacherPortalPage';
import { LayoutEngineProvider, useLayoutEngine } from './config/layoutEngine';
import { GlobalLoadingOverlay } from './components/LoadingEngine';

// Componente auxiliar para interceptar cliques nos links do index.html estático
function GlobalLinkInterceptor() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (target && target.href) {
        const url = new URL(target.href);
        // Se for um link interno (mesmo domínio) e não for âncora (#)
        if (url.origin === window.location.origin && !target.getAttribute('href')?.startsWith('#')) {
          e.preventDefault();
          navigate(url.pathname + url.search);
        }
      }
    };

    document.addEventListener('click', handleLinkClick);
    return () => document.removeEventListener('click', handleLinkClick);
  }, [navigate]);

  return null;
}

function BodyClassManager() {
  const location = useLocation();
  const { preferences } = useLayoutEngine();
  const isLandingPage = location.pathname === '/' || location.pathname === '';

  useEffect(() => {
    if (!isLandingPage || preferences.layoutPreset.landing !== 'classic') {
      document.body.classList.add('react-active');
    } else {
      document.body.classList.remove('react-active');
    }
  }, [isLandingPage, preferences.layoutPreset.landing]);

  return null;
}

function AppRoutes() {
  const { preferences } = useLayoutEngine();

  const renderHomeEntry = () => {
    if (preferences.defaultEntryPage === 'portal') {
      return <Navigate to="/portal" replace />;
    }
    if (preferences.defaultEntryPage === 'professor') {
      return <Navigate to="/professor" replace />;
    }
    if (preferences.defaultEntryPage === 'admin') {
      return <Navigate to="/admin" replace />;
    }
    return <LandingHubPage />;
  };

  return (
    <Routes>
      <Route path="/" element={renderHomeEntry()} />
      <Route path="/portal" element={<PortalAluno />} />
      <Route path="/professor" element={<TeacherPortalPage />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/agendar" element={<AgendarAula />} />
      {/* Redirecionamentos seguros: Estatísticas e Ranking exigem autenticação de CPF no Portal do Aluno */}
      <Route path="/dashboard-lutador" element={<Navigate to="/portal?tab=desempenho" replace />} />
      <Route path="/ranking" element={<Navigate to="/portal?tab=ranking" replace />} />
      <Route path="/perfil-lutador" element={<FighterProfile />} />
    </Routes>
  );
}

function App() {
  return (
    <LayoutEngineProvider>
      <Router>
        <GlobalLinkInterceptor />
        <BodyClassManager />
        <GlobalLoadingOverlay />
        <AppRoutes />
      </Router>
    </LayoutEngineProvider>
  );
}

export default App;
