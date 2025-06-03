import React from 'react';
import { useMemo } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';

import { useAuthStore } from '../stores/authStore';
import { logger } from '../utils/logger';

import About from './routes/About';
import Contact from './routes/Contact';
import LoggedinHomePage from './routes/LoggedinHomePage';
import Login from './routes/Login';
import NotFound from './routes/NotFound';
import ReportBug from './routes/ReportBug';
import SafetyBlog from './routes/SafetyBlog';
import SidebarLoggedIn from './routes/SidebarLoggedIn';
import SidebarLoggedOut from './routes/SidebarLoggedOut';
import Signup from './routes/Signup';
import Terms from './routes/Terms';
// import FAQ from './routes/FAQ'; // TODO: Add FAQ route when component exists

function RequireEmailVerified({ children }: { children: React.ReactNode }) {
  const user = useAuthStore(state => state.user);
  const location = useLocation();

  logger.log('Route accessed', { path: location.pathname, user });

  const needsVerification = useMemo(() => {
    if (!user) return false;
    const notVerified = !user.email_confirmed_at;
    const createdAt = user.created_at ? new Date(user.created_at) : null;
    const now = Date.now();
    const msIn24h = 24 * 60 * 60 * 1000;
    const expired = createdAt && now - createdAt.getTime() > msIn24h;
    return notVerified && expired;
  }, [user]);

  if (needsVerification && location.pathname !== '/auth/verify-email') {
    logger.log('Redirecting to /auth/verify-email', { user });
    return <Navigate to='/auth/verify-email' replace />;
  }
  return children;
}

export default function Router() {
  const user = useAuthStore(state => state.user);
  return (
    <BrowserRouter>
      <RequireEmailVerified>
        <Routes>
          {user ? (
            // Logged in experience
            <Route path='/' element={<SidebarLoggedInWrapper />}>
              <Route index element={<LoggedinHomePage />} />
            </Route>
          ) : (
            // Logged out experience
            <Route path='/' element={<SidebarLoggedOutWrapper />}>
              <Route index element={<Login />} />
              <Route path='auth/login' element={<Login />} />
              <Route path='auth/signup' element={<Signup />} />
            </Route>
          )}
          {/* General pages (footer links) */}
          <Route path='/about' element={<About />} />
          <Route path='/blog' element={<SafetyBlog />} />
          <Route path='/terms' element={<Terms />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/report-bug' element={<ReportBug />} />
          {/* <Route path='/faq' element={<FAQ />} /> */}{' '}
          {/* TODO: Add FAQ route when component exists */}
          {/* 404 Not Found */}
          <Route path='*' element={<NotFound />} />
        </Routes>
      </RequireEmailVerified>
    </BrowserRouter>
  );
}

function SidebarLoggedOutWrapper() {
  logger.log('Rendering SidebarLoggedOut for unauthenticated user');
  return <SidebarLoggedOut />;
}

function SidebarLoggedInWrapper() {
  logger.log('Rendering SidebarLoggedIn for authenticated user');
  return <SidebarLoggedIn />;
}
