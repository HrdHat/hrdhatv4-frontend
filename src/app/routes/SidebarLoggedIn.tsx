import { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';

import { useAuthStore } from '@/stores/authStore';
import { useFormStore } from '@/stores/formStore';
import { logger } from '@/utils/logger';

import ActiveFormsList from './ActiveFormsList';
import ArchivedFormsList from './ArchivedFormsList';
import NewFormList from './NewFormList';
import Sidebar from '@/components/Sidebar/Sidebar';
import DoubleArrowIcon from '@/components/Icon/DoubleArrowIcon';
import Button from '@/components/Button/Button';
import useBreakpoint from '@/hooks/useBreakpoint';
import '@/styles/components/drawer.css';

export default function SidebarLoggedIn() {
  const logout = useAuthStore(state => state.logout);
  const loading = useAuthStore(state => state.loading);
  const navigate = useNavigate();
  const [panel, setPanel] = useState<'active' | 'archived' | 'profile' | 'new'>(
    'active'
  );
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const bp = useBreakpoint();

  // Form store state for checking if a form is currently open
  const { currentForm, hasUnsavedChanges } = useFormStore();

  // Helper: close both sidebar and drawer
  const closeSidebar = () => {
    setDrawerOpen(false);
    setSidebarOpen(false);
  };

  useEffect(() => {
    logger.log('SidebarLoggedIn rendered');
  }, []);

  const handleLogout = async () => {
    logger.log('Logout button clicked');
    await logout();
    navigate('/');
  };

  const handleCreateNewFLRA = () => {
    logger.log('Create New FLRA button clicked');

    // Check if there's a form currently open
    if (currentForm) {
      const message = hasUnsavedChanges
        ? 'Are you sure you want to close this form and start a new one? You have unsaved changes that will be lost.'
        : 'Are you sure you want to close this form and start a new one?';

      const confirmed = window.confirm(message);
      if (!confirmed) {
        logger.log('User cancelled creating new form');
        return;
      }
    }

    setDrawerOpen(false); // Close the drawer after confirmation
    // Navigate to the new form route
    navigate('/form/new');
  };

  const handlePanelChange = (
    newPanel: 'active' | 'archived' | 'profile' | 'new'
  ) => {
    if (newPanel === 'new') {
      // If a form is open, prompt the user
      if (currentForm) {
        const message = hasUnsavedChanges
          ? 'Are you sure you want to close this form and start a new one? You have unsaved changes that will be lost.'
          : 'Are you sure you want to close this form and start a new one?';
        const confirmed = window.confirm(message);
        if (!confirmed) {
          logger.log('User cancelled creating new form from panel');
          return;
        }
      }
      setPanel('new');
      setDrawerOpen(false); // Close the drawer after confirmation
    } else if (newPanel === 'profile') {
      // Handle profile navigation - check for open forms first, then navigate to main area
      if (currentForm) {
        const message = hasUnsavedChanges
          ? 'Are you sure you want to close this form and go to your profile? You have unsaved changes that will be lost.'
          : 'Are you sure you want to close this form and go to your profile?';
        const confirmed = window.confirm(message);
        if (!confirmed) {
          logger.log('User cancelled navigating to profile');
          return;
        }
      }
      // Navigate to profile page in main content area
      setDrawerOpen(false); // Close the drawer
      navigate('/profile');
    } else {
      setPanel(newPanel);
      setDrawerOpen(true); // Open drawer for other panels
      if (bp === 'mobile') {
        setSidebarOpen(false);
      }
    }
  };

  // Render drawer content based on selected panel
  const renderDrawerContent = () => {
    switch (panel) {
      case 'active':
        return <ActiveFormsList />;
      case 'archived':
        return <ArchivedFormsList />;
      case 'new':
        return <NewFormList />;
      default:
        return <ActiveFormsList />;
    }
  };

  return (
    <div className='sidebar-layout'>
      {/* Slide-in Sidebar container */}
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar}>
        {/* Close-arrow button inside the sidebar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            padding: '0.75rem 1rem 0',
          }}
        >
          <button
            type='button'
            onClick={closeSidebar}
            aria-label='Close sidebar'
            style={{ background: 'transparent', border: 'none', padding: 0 }}
          >
            <DoubleArrowIcon direction='left' />
          </button>
        </div>
        <div
          style={{ width: '100%' }}
          className={drawerOpen ? 'drawer-open' : 'drawer-closed'}
        >
          {/* Navigation wrapped with responsive padding similar to logged-out sidebar */}
          <div
            style={{
              padding: bp === 'mobile' ? '1rem' : '1.5rem 1rem 0',
              paddingTop: bp === 'mobile' ? '1.75rem' : '2.25rem',
            }}
          >
            <nav className='sidebar-nav o-stack o-stack--sm'>
              <Button
                variant='neon'
                fullWidth
                onClick={() => handlePanelChange('active')}
                className={panel === 'active' ? 'active' : ''}
              >
                Active Forms
              </Button>
              <Button
                variant='neon'
                fullWidth
                onClick={() => handlePanelChange('archived')}
                className={panel === 'archived' ? 'active' : ''}
              >
                Archived Forms
              </Button>
              <Button
                variant='neon'
                fullWidth
                onClick={() => handlePanelChange('profile')}
                className={panel === 'profile' ? 'active' : ''}
              >
                Profile
              </Button>
              <Button
                variant='neon'
                fullWidth
                onClick={() => handlePanelChange('new')}
                className={panel === 'new' ? 'active' : ''}
              >
                New Form
              </Button>
              <Button variant='green' fullWidth onClick={handleCreateNewFLRA}>
                Create New FLRA
              </Button>
              <Button
                variant='neutral'
                fullWidth
                onClick={handleLogout}
                disabled={loading}
                className='logout-btn'
              >
                {loading ? 'Logging out...' : 'Log Out'}
              </Button>
            </nav>
          </div>
        </div>
      </Sidebar>

      {/* Arrow toggle to reopen sidebar when closed */}
      {!sidebarOpen && (
        <button
          type='button'
          onClick={() => setSidebarOpen(true)}
          aria-label='Open sidebar'
          style={{
            position: 'fixed',
            top: '1.5rem',
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

      <main className='main-content'>
        <Outlet
          context={{
            toggleSidebar: () => setSidebarOpen(prev => !prev),
            sidebarOpen,
          }}
        />
      </main>

      {/* Drawer – gallery style (sibling to Sidebar) */}
      {drawerOpen && (
        <aside className='c-drawer is-open'>
          <button
            type='button'
            onClick={() => setDrawerOpen(false)}
            aria-label='Close drawer'
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: 'transparent',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
            }}
          >
            <DoubleArrowIcon direction='left' />
          </button>
          <div style={{ padding: '1rem', paddingTop: '3.25rem' }}>
            {renderDrawerContent()}
          </div>
        </aside>
      )}
    </div>
  );
}
