import { Outlet, Link } from 'react-router-dom';
import { Package, LogOut, Store, User } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export const SellerLayout = () => {
  const { logout, username } = useAuthStore();

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <Store className="w-6 h-6 text-purple-600 mr-2" />
          <span className="font-bold text-lg text-gray-800">Satıcı Paneli</span>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Link to="/seller" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-purple-50 hover:text-purple-700">
            <User className="w-5 h-5" /> Profilim
          </Link>
          <Link to="/seller/items" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-purple-50 hover:text-purple-700">
            <Package className="w-5 h-5" /> Ürünlerim
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

      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default SellerLayout;
