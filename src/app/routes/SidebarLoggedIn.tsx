import { useEffect } from 'react';

import { useAuthStore } from '../../stores/authStore';
import { logger } from '../../utils/logger';

export default function SidebarLoggedIn() {
  const logout = useAuthStore(state => state.logout);
  const loading = useAuthStore(state => state.loading);

  useEffect(() => {
    logger.log('SidebarLoggedIn rendered');
  }, []);

  const handleLogout = () => {
    logger.log('Logout button clicked');
    logout();
  };

  return (
    <div>
      Sidebar (Logged In)
      <button
        onClick={handleLogout}
        disabled={loading}
        style={{ marginLeft: 16 }}
      >
        {loading ? 'Logging out...' : 'Log Out'}
      </button>
    </div>
  );
}
