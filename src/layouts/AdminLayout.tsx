import { Outlet, Link } from 'react-router-dom';
import { Users, LogOut, Package, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export const AdminLayout = () => {
  const { logout, username } = useAuthStore();

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <ShieldCheck className="w-6 h-6 text-purple-600 mr-2" />
          <span className="font-bold text-lg text-gray-800">Admin Paneli</span>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Link to="/admin" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-purple-50 hover:text-purple-700">
            <Users className="w-5 h-5" /> Kullanıcılar
          </Link>
          <Link to="/admin/items" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-purple-50 hover:text-purple-700">
            <Package className="w-5 h-5" /> Ürünler
          </Link>
          <Link to="/" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-gray-400 hover:text-gray-700 mt-4 border-t border-gray-100 pt-4">
            Siteye Dön
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600 truncate">{username}</span>
            <button onClick={logout} className="text-gray-400 hover:text-red-500">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
