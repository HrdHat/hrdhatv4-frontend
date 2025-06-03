import { Outlet } from 'react-router-dom';

export default function SidebarLoggedOut() {
  return (
    <div>
      <aside>
        <nav>
          <ul>{/* No auth links needed */}</ul>
        </nav>
      </aside>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
