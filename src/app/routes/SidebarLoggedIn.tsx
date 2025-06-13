import { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';

import { useAuthStore } from '@/stores/authStore';
import { useFormStore } from '@/stores/formStore';
import { logger } from '@/utils/logger';

import ActiveFormsList from './ActiveFormsList';
import ArchivedFormsList from './ArchivedFormsList';
import NewFormList from './NewFormList';

export default function SidebarLoggedIn() {
  const logout = useAuthStore(state => state.logout);
  const loading = useAuthStore(state => state.loading);
  const navigate = useNavigate();
  const [panel, setPanel] = useState<'active' | 'archived' | 'profile' | 'new'>(
    'active'
  );
  const [drawerOpen, setDrawerOpen] = useState(true);

  // Form store state for checking if a form is currently open
  const { currentForm, hasUnsavedChanges } = useFormStore();

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
      {/* Sidebar with Navigation and Drawer */}
      <aside
        className={`sidebar ${drawerOpen ? 'drawer-open' : 'drawer-closed'}`}
      >
        {/* Navigation */}
        <nav className='sidebar-nav'>
          <button
            onClick={() => handlePanelChange('active')}
            className={panel === 'active' ? 'active' : ''}
          >
            Active Forms
          </button>
          <button
            onClick={() => handlePanelChange('archived')}
            className={panel === 'archived' ? 'active' : ''}
          >
            Archived Forms
          </button>
          <button
            onClick={() => handlePanelChange('profile')}
            className={panel === 'profile' ? 'active' : ''}
          >
            Profile
          </button>
          <button
            onClick={() => handlePanelChange('new')}
            className={panel === 'new' ? 'active' : ''}
          >
            New Form
          </button>
          <button onClick={handleCreateNewFLRA}>Create New FLRA</button>
          <button
            onClick={handleLogout}
            disabled={loading}
            className='logout-btn'
          >
            {loading ? 'Logging out...' : 'Log Out'}
          </button>
        </nav>

        {/* Drawer Content */}
        {drawerOpen && (
          <div className='drawer'>
            <div className='drawer-header'>
              <button
                onClick={() => setDrawerOpen(false)}
                className='drawer-close'
                aria-label='Close drawer'
              >
                ✕
              </button>
            </div>
            <div className='drawer-content'>{renderDrawerContent()}</div>
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <main className='main-content'>
        <Outlet />
      </main>
    </div>
  );
}
