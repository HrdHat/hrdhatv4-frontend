import React from 'react';
import { useMemo } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

import { useAuthStore } from '@/stores/authStore';
import { logger } from '@/utils/logger';

import About from './routes/About';
import Contact from './routes/Contact';
import ErrorPage from './routes/ErrorPage';
import FAQ from './routes/FAQ';
import FormEditor from './routes/FormEditor';
import GuidedEditor from './routes/GuidedEditor';
import LoggedinHomePage from './routes/LoggedinHomePage';
import Login from './routes/Login';
import Maintenance from './routes/Maintenance';
import NotFound from './routes/NotFound';
import Profile from './routes/Profile';
import ReportBug from './routes/ReportBug';
import SafetyBlog from './routes/SafetyBlog';
import SidebarLoggedIn from './routes/SidebarLoggedIn';
import SidebarLoggedOut from './routes/SidebarLoggedOut';
import Signup from './routes/Signup';
import Terms from './routes/Terms';
import Unauthorized from './routes/Unauthorized';
import VerifyEmail from './routes/VerifyEmail';
import Gallery from './routes/Gallery';
import FormSample from './routes/FormSample';
// import FAQ from './routes/FAQ'; // TODO: Add FAQ route when component exists

function RequireEmailVerified({ children }: { children: React.ReactNode }) {
  const user = useAuthStore(state => state.user);
  const location = useLocation();

  logger.log('Route accessed', { path: location.pathname, user });

  const needsVerification = useMemo(() => {
    if (!user) return false;
    return !user.email_confirmed_at;
  }, [user]);

  if (needsVerification && location.pathname !== '/auth/verify-email') {
    logger.log('Redirecting to /auth/verify-email', { user });
    return <Navigate to='/auth/verify-email' replace />;
  }
  return children;
}

export default function AppRoutes() {
  const { user, hasCheckedAuth } = useAuthStore();
  logger.log('Router rendered', { user, hasCheckedAuth });

  if (!hasCheckedAuth) {
    return (
      <div style={{ padding: '2rem', color: 'var(--color-neon-green)' }}>
        Loading...
      </div>
    );
  }

  return (
    <RequireEmailVerified>
      <Routes>
        {user ? (
          // Logged in experience
          <Route path='/' element={<SidebarLoggedInWrapper />}>
            <Route index element={<LoggedinHomePage />} />
            <Route path='profile' element={<Profile />} />
            <Route path='form/new' element={<FormEditor />} />
            <Route path='form/:id' element={<FormEditor />} />
            <Route path='form/:id/guided' element={<GuidedEditor />} />
          </Route>
        ) : (
          // Logged out experience
          <Route path='/' element={<SidebarLoggedOutWrapper />}>
            <Route index element={<Login />} />
            <Route path='auth/login' element={<Login />} />
            <Route path='auth/signup' element={<Signup />} />
          </Route>
        )}
        {/* Auth pages (accessible regardless of login status) */}
        <Route path='/auth/verify-email' element={<VerifyEmail />} />
        {/* General pages (footer links) */}
        <Route path='/about' element={<About />} />
        <Route path='/blog' element={<SafetyBlog />} />
        <Route path='/terms' element={<Terms />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/report-bug' element={<ReportBug />} />
        <Route path='/faq' element={<FAQ />} />
        {/* Dev component gallery */}
        <Route path='/gallery' element={<Gallery />} />
        <Route path='/form-sample' element={<FormSample />} />
        <Route path='/500' element={<ErrorPage />} />
        <Route path='/unauthorized' element={<Unauthorized />} />
        <Route path='/maintenance' element={<Maintenance />} />
        {/* 404 Not Found */}
        <Route path='*' element={<NotFound />} />
      </Routes>
    </RequireEmailVerified>
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
