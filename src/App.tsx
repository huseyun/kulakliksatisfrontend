import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/auth/Login';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import SellerLayout from './layouts/SellerLayout';
import Home from './pages/public/Home';
import ShopperProfile from './pages/public/ShopperProfile';
import SellerProfile from './pages/seller/SellerProfile';
import SellerItems from './pages/seller/SellerItems';

import AdminUsers from './pages/admin/AdminUsers';
import AdminItems from './pages/admin/AdminItems';
import Register from './pages/auth/Register';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Public / Shopper */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        {/* Protected Shopper Routes */}
        <Route element={<ProtectedRoute allowedRoles={['SHOPPER', 'USER']} />}>
           <Route path="profile" element={<ShopperProfile />} />
        </Route>
      </Route>

      {/* Admin */}
      <Route path="/admin" element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
        <Route element={<AdminLayout />}>
          <Route index element={<AdminUsers />} />
          <Route path="items" element={<AdminItems />} />
        </Route>
      </Route>

      {/* Seller */}
      <Route path="/seller" element={<ProtectedRoute allowedRoles={['SELLER']} />}>
        <Route element={<SellerLayout />}>
          <Route index element={<SellerProfile />} />
          <Route path="items" element={<SellerItems />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
