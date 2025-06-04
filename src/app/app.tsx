import Provider from './provider';
import Router from './router';
import ResponsiveLayout from '../components/ResponsiveLayout/ResponsiveLayout';

export default function App() {
  return (
    <Provider>
      <ResponsiveLayout>
        <Router />
      </ResponsiveLayout>
    </Provider>
  );
}
