import { Outlet } from 'react-router-dom';

export default function SidebarLoggedOut() {
  return (
    <div style={{ display: 'flex' }}>
      <aside style={{ minWidth: 200, background: '#f5f5f5', padding: 16 }}>
        Sidebar (Logged Out)
        {/* Add navigation links here if needed */}
      </aside>
      <main style={{ flex: 1, padding: 16 }}>
        <Outlet />
      </main>
    </div>
  );
}
