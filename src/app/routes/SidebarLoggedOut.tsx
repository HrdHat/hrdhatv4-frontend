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
            padding: bp === 'mobile' ? '1rem' : '1.5rem 1rem 0',
            paddingTop: bp === 'mobile' ? '1.75rem' : '2.25rem',
          }}
        >
          <Outlet
            context={{
              toggleSidebar: () => setSidebarOpen(prev => !prev),
              sidebarOpen,
            }}
          />
        </div>
      </Sidebar>

      {/* Arrow toggle button for when sidebar is closed (so user can reopen) */}
      {!sidebarOpen && (
        <button
          type='button'
          onClick={() => setSidebarOpen(true)}
          aria-label='Open sidebar'
          style={{
            position: 'fixed',
            top: bp === 'mobile' ? '1.75rem' : '2.25rem',
            left: '1rem',
            zIndex: 99999,
            background: 'transparent',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
          }}
        >
          <DoubleArrowIcon direction='right' />
        </button>
      )}

      {/* Main content area can host marketing / public info later */}
      <main className='main-content' />
    </div>
  );
}
