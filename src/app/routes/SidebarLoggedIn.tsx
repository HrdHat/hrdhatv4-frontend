import { useEffect, useState } from 'react';

import { useAuthStore } from '../../stores/authStore';
import { logger } from '../../utils/logger';
import ActiveFormsList from './ActiveFormsList';
import ArchivedFormsList from './ArchivedFormsList';
import Profile from './Profile';
import NewFormList from './NewFormList';

export default function SidebarLoggedIn() {
  const logout = useAuthStore(state => state.logout);
  const loading = useAuthStore(state => state.loading);
  const [panel, setPanel] = useState<'active' | 'archived' | 'profile' | 'new'>(
    'active'
  );

  useEffect(() => {
    logger.log('SidebarLoggedIn rendered');
  }, []);

  const handleLogout = () => {
    logger.log('Logout button clicked');
    logout();
  };

  let content;
  switch (panel) {
    case 'active':
      content = <ActiveFormsList />;
      break;
    case 'archived':
      content = <ArchivedFormsList />;
      break;
    case 'profile':
      content = <Profile />;
      break;
    case 'new':
      content = <NewFormList />;
      break;
    default:
      content = null;
  }

  return (
    <div>
      <aside>
        <nav>
          <button onClick={() => setPanel('active')}>Active Forms</button>
          <button onClick={() => setPanel('archived')}>Archived Forms</button>
          <button onClick={() => setPanel('profile')}>Profile</button>
          <button onClick={() => setPanel('new')}>New Form</button>
          <button
            onClick={handleLogout}
            disabled={loading}
            style={{ marginLeft: 16 }}
          >
            {loading ? 'Logging out...' : 'Log Out'}
          </button>
        </nav>
      </aside>
      <main>{content}</main>
    </div>
  );
}
