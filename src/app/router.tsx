import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useMemo } from 'react';

import SidebarLoggedOut from './routes/SidebarLoggedOut';
import LoggedoutHomePage from './routes/LoggedoutHomePage';
import Login from './routes/Login';
import Signup from './routes/Signup';
import About from './routes/About';
import SafetyBlog from './routes/SafetyBlog';
import Terms from './routes/Terms';
import Contact from './routes/Contact';
import ReportBug from './routes/ReportBug';
// import FAQ from './routes/FAQ'; // TODO: Add FAQ route when component exists
import NotFound from './routes/NotFound';

function RequireEmailVerified({ children }: { children: React.ReactNode }) {
  const user = useAuthStore(state => state.user);
  const location = useLocation();

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
    return <Navigate to='/auth/verify-email' replace />;
  }
  return children;
}

export default function Router() {
  return (
    <BrowserRouter>
      <RequireEmailVerified>
        <Routes>
          {/* Logged out sidebar and nested routes */}
          <Route path='/' element={<SidebarLoggedOut />}>
            <Route index element={<LoggedoutHomePage />} />
            <Route path='auth/login' element={<Login />} />
            <Route path='auth/signup' element={<Signup />} />
          </Route>
          {/* General pages (footer links) */}
          <Route path='/about' element={<About />} />
          <Route path='/blog' element={<SafetyBlog />} />
          <Route path='/terms' element={<Terms />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/report-bug' element={<ReportBug />} />
          {/* <Route path='/faq' element={<FAQ />} /> */} // TODO: Add FAQ route
          when component exists
          {/* TODO: Add logged in routes here */}
          {/* 404 Not Found */}
          <Route path='*' element={<NotFound />} />
        </Routes>
      </RequireEmailVerified>
    </BrowserRouter>
  );
}
