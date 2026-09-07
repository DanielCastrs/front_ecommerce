import { Outlet } from 'react-router-dom';

import { Header } from '../components/Header/Header';

export function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <Outlet />
    </div>
  );
}