import { Outlet } from 'react-router-dom';
import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar/Sidebar';
import DoubleArrowIcon from '@/components/Icon/DoubleArrowIcon';
import useBreakpoint from '@/hooks/useBreakpoint';

export default function SidebarLoggedOut() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const bp = useBreakpoint();

  return (
    <div className='sidebar-layout'>
      {/* Shared slide-in Sidebar */}
      <Sidebar isOpen={sidebarOpen}>
        {/* Login form (and other unauth routes) offset below arrow toggle */}
        <div
          style={{
            marginTop: bp === 'mobile' ? '4rem' : '5rem',
            padding: '0 1rem',
          }}
        >
          <Outlet />
        </div>
      </Sidebar>

      {/* Arrow toggle button (same behaviour as Gallery) */}
      <button
        type='button'
        onClick={() => setSidebarOpen(prev => !prev)}
        aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        style={{
          position: 'fixed',
          top: bp === 'mobile' ? '1rem' : '20px',
          left: bp === 'mobile' ? '1rem' : '20px',
          zIndex: 99999,
          background: 'transparent',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
        }}
      >
        <DoubleArrowIcon direction={sidebarOpen ? 'left' : 'right'} />
      </button>

      {/* Main content area can host marketing / public info later */}
      <main className='main-content' />
    </div>
  );
}
