import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

export const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-gray-50 border-x border-gray-200 w-full max-w-7xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
