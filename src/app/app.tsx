import ResponsiveLayout from '@/components/ResponsiveLayout/ResponsiveLayout';

import AppProvider from './AppProvider';
import AppRoutes from './router';

export default function App() {
  return (
    <AppProvider>
      <ResponsiveLayout>
        <AppRoutes />
      </ResponsiveLayout>
    </AppProvider>
  );
}
