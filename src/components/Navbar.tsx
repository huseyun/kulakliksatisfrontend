import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, UserCircle, LogOut, Settings } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export const Navbar = () => {
  const { isAuthenticated, username, roles, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-purple-600" />
            <span className="font-bold text-xl tracking-tight text-gray-900">KulaklıkSepetim</span>
          </Link>
          
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                 <span className="text-sm font-medium text-gray-600">Merhaba, {username}</span>
                 {roles.includes("ADMIN") && (
                   <Link to="/admin" className="text-gray-500 hover:text-purple-600 transition-colors">
                     <Settings className="w-5 h-5" />
                   </Link>
                 )}
                 {roles.includes("SELLER") && (
                   <Link to="/seller" className="text-gray-500 hover:text-purple-600 transition-colors">
                     <Settings className="w-5 h-5" />
                   </Link>
                 )}
                 {roles.includes("SHOPPER") && (
                   <Link to="/profile" className="text-gray-500 hover:text-purple-600 transition-colors" title="Hesabım">
                     <UserCircle className="w-5 h-5" />
                   </Link>
                 )}
                 <button onClick={handleLogout} className="text-gray-500 hover:text-red-500 transition-colors">
                   <LogOut className="w-5 h-5" />
                 </button>
              </div>
            ) : (
              <Link to="/login" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm font-medium transition-colors text-gray-700">
                <UserCircle className="w-5 h-5" />
                Giriş Yap
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
