import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { type UserResponse, type ItemSummaryResponse, type SellerResponse } from '../../types';
import toast from 'react-hot-toast';
import { ShieldAlert, Trash2, Plus, Edit, Package, Users as UsersIcon, Anchor, ShoppingBag, ShieldCheck } from 'lucide-react';

export const AdminUsers = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'admins' | 'sellers' | 'shoppers'>('all');
  const [users, setUsers] = useState<any[]>([]); // Mixed types based on tab
  const [loading, setLoading] = useState(false);

  // Modals state
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showSellerModal, setShowSellerModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSellerEditModal, setShowSellerEditModal] = useState(false);
  const [showShopperEditModal, setShowShopperEditModal] = useState(false);
  const [showItemsModal, setShowItemsModal] = useState(false);

  // Forms state
  const [formData, setFormData] = useState({ username: '', email: '', password: '', companyName: '', firstName: '', lastName: '' });
  const [selectedUserId, setSelectedUserId] = useState<string | number | null>(null);
  
  const [sellerItems, setSellerItems] = useState<ItemSummaryResponse[]>([]);
  const [itemsLoading, setItemsLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [activeTab]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      let endpoint = '/api/admin/users';
      if (activeTab === 'admins') endpoint = '/api/admin/admins';
      else if (activeTab === 'sellers') endpoint = '/api/admin/sellers';
      else if (activeTab === 'shoppers') endpoint = '/api/admin/shoppers';

      const response = await axiosClient.get(endpoint);
      
      const payload = response.data;
      if (Array.isArray(payload)) {
        setUsers(payload);
      } else if (payload && typeof payload === 'object' && 'content' in payload) {
         setUsers(payload.content);
      } else {
        setUsers(payload ? [payload] : []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ username: '', email: '', password: '', companyName: '', firstName: '', lastName: '' });
  };

  const handleDelete = async (id: string | number) => {
    if (!window.confirm('Bu kullanıcıyı silmek istediğinize emin misiniz?')) return;
    try {
      await axiosClient.delete(`/api/admin/users/${id}`);
      toast.success('Kullanıcı silindi.');
      fetchUsers();
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axiosClient.post('/api/admin/admins', { username: formData.username, email: formData.email, password: formData.password });
      toast.success('Admin oluşturuldu!');
      setShowAdminModal(false);
      resetForm();
      fetchUsers();
    } catch (error) { console.error(error); }
  };

  const handleCreateSeller = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axiosClient.post('/api/admin/sellers', { username: formData.username, email: formData.email, password: formData.password, companyName: formData.companyName });
      toast.success('Satıcı oluşturuldu!');
      setShowSellerModal(false);
      resetForm();
      fetchUsers();
    } catch (error) { console.error(error); }
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axiosClient.put(`/api/admin/users/${selectedUserId}`, { username: formData.username, email: formData.email, password: formData.password });
      toast.success('Kullanıcı güncellendi!');
      setShowEditModal(false);
      resetForm();
      fetchUsers();
    } catch (error) { console.error(error); }
  };

  const handleEditSeller = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axiosClient.put(`/api/admin/sellers/${selectedUserId}`, { 
         username: formData.username, 
         email: formData.email, 
         companyName: formData.companyName 
      });
      toast.success('Satıcı özel bilgileri güncellendi!');
      setShowSellerEditModal(false);
      resetForm();
      fetchUsers();
    } catch (error) { console.error(error); }
  };

  const handleEditShopperDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axiosClient.put(`/api/admin/shoppers/${selectedUserId}/details`, { 
         firstName: formData.firstName, 
         lastName: formData.lastName
      });
      toast.success('Müşteri (Shopper) bilgileri güncellendi!');
      setShowShopperEditModal(false);
      resetForm();
      fetchUsers();
    } catch (error) { console.error(error); }
  };

  const openSellerItems = async (sellerId: string | number) => {
    setShowItemsModal(true);
    setItemsLoading(true);
    setSellerItems([]);
    try {
      const response = await axiosClient.get(`/api/admin/sellers/${sellerId}/items`);
      setSellerItems(response.data);
    } catch (error) {
      console.error(error);
      toast.error("İlanlar çekilemedi.");
    } finally {
      setItemsLoading(false);
    }
  };

  const openEditModal = (user: any) => {
    setSelectedUserId(user.id);
    setFormData({ username: user.username, email: user.email || '', password: '', companyName: '', firstName: '', lastName: '' });
    setShowEditModal(true);
  };

  const openSellerEditModal = async (sellerId: string | number) => {
    setSelectedUserId(sellerId);
    setFormData({ username: '', email: '', password: '', companyName: '', firstName: '', lastName: '' });
    setShowSellerEditModal(true);
    
    try {
       const response = await axiosClient.get(`/api/admin/sellers/${sellerId}`);
       const sellerData = response.data; // SellerDetailedResponse
       setFormData({
          username: sellerData.username || '',
          email: sellerData.email || '',
          password: '',
          companyName: sellerData.companyName || '',
          firstName: '',
          lastName: ''
       });
    } catch(err) {
       console.log(err);
       toast.error('Satıcı detayı yüklenemedi!');
    }
  };

  const openShopperEditModal = async (shopperId: string | number) => {
    setSelectedUserId(shopperId);
    setFormData({ username: '', email: '', password: '', companyName: '', firstName: '', lastName: '' });
    setShowShopperEditModal(true);

    try {
       const response = await axiosClient.get(`/api/admin/shoppers/${shopperId}`);
       const shopperData = response.data; 
       setFormData({
          username: '',
          email: '',
          password: '',
          companyName: '',
          firstName: shopperData.firstName || '',
          lastName: shopperData.lastName || ''
       });
    } catch(err) {
       console.log(err);
       toast.error('Müşteri detayı yüklenemedi!');
    }
  };

  const openCreateAdmin = () => { resetForm(); setShowAdminModal(true); };
  const openCreateSeller = () => { resetForm(); setShowSellerModal(true); };

  const isSeller = (user: any) => {
     if (activeTab === 'sellers') return true;
     return user.userType && user.userType.some((t: any) => t.userType === 'SELLER');
  };

  return (
    <div className="animate-in fade-in">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Sistem Kullanıcıları</h2>
          <p className="text-gray-500 text-sm mt-1">Platformdaki üyeleri rol bazlı izole olarak denetleyin.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
           <button onClick={openCreateSeller} className="flex items-center gap-2 bg-orange-100 hover:bg-orange-200 text-orange-700 px-4 py-2 rounded-lg font-medium transition-colors">
             <Plus className="w-5 h-5" /> Satıcı Ekle
           </button>
           <button onClick={openCreateAdmin} className="flex items-center gap-2 bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg font-medium transition-colors">
             <ShieldAlert className="w-5 h-5" /> Admin Ekle
           </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl mb-6 w-full lg:w-max">
        <button onClick={() => setActiveTab('all')} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all ${activeTab === 'all' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500 hover:text-gray-700'}`}>
          <UsersIcon className="w-4 h-4" /> Tüm Kullanıcılar
        </button>
        <button onClick={() => setActiveTab('admins')} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all ${activeTab === 'admins' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500 hover:text-gray-700'}`}>
          <ShieldCheck className="w-4 h-4" /> Yönetici Seçkisi
        </button>
        <button onClick={() => setActiveTab('sellers')} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all ${activeTab === 'sellers' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500 hover:text-gray-700'}`}>
          <Anchor className="w-4 h-4" /> Satıcı Konsolu
        </button>
        <button onClick={() => setActiveTab('shoppers')} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all ${activeTab === 'shoppers' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500 hover:text-gray-700'}`}>
          <ShoppingBag className="w-4 h-4" /> Müşteriler
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500 animate-pulse">Kullanıcılar Yükleniyor...</div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Bu kategoride kimse bulunmuyor.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-100">
                  <th className="p-4 font-semibold">ID</th>
                  <th className="p-4 font-semibold">Kullanıcı Adı</th>
                  <th className="p-4 font-semibold">E-Posta</th>
                  
                  {/* Satıcı Tab'ına Özel Kolon */}
                  {activeTab === 'sellers' && <th className="p-4 font-semibold">Şirket Adı</th>}
                  {/* Müşteri Tab'ına Özel Kolonlar */}
                  {activeTab === 'shoppers' && (
                     <>
                       <th className="p-4 font-semibold">Ad</th>
                       <th className="p-4 font-semibold">Soyad</th>
                     </>
                  )}
                  {/* Tüm Kullanıcılar Tab'ına Özel Kolon */}
                  {activeTab === 'all' && <th className="p-4 font-semibold">Rol</th>}
                  
                  <th className="p-4 flex justify-end font-semibold text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-mono text-xs text-gray-500">{user.id}</td>
                    <td className="p-4 font-medium text-gray-800">{user.username}</td>
                    <td className="p-4 text-gray-600">{user.email || '-'}</td>
                    
                    {activeTab === 'sellers' && (
                       <td className="p-4 text-orange-600 font-medium">{user.companyName || '-'}</td>
                    )}
                    
                    {activeTab === 'shoppers' && (
                       <>
                         <td className="p-4 text-gray-800 font-medium">{user.firstName || '-'}</td>
                         <td className="p-4 text-gray-800 font-medium">{user.lastName || '-'}</td>
                       </>
                    )}

                    {activeTab === 'all' && (
                       <td className="p-4">
                         {user.userType && user.userType.map((t: any, idx: number) => (
                           <span key={idx} className={`px-2 py-1 text-xs font-medium rounded-full mr-1 inline-block ${
                             t.userType === 'ADMIN' ? 'bg-red-100 text-red-700' :
                             t.userType === 'SELLER' ? 'bg-orange-100 text-orange-700' :
                             'bg-blue-100 text-blue-700'
                           }`}>
                             {t.userType}
                           </span>
                         ))}
                       </td>
                    )}

                    <td className="p-4 flex justify-end gap-2">
                       {/* Ürünleri Gör (Eğer Satıcıysa) */}
                      {isSeller(user) && (
                         <button onClick={() => openSellerItems(user.id)} className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Mağaza Vitrinini Gör">
                           <Package className="w-5 h-5" />
                         </button>
                      )}

                      {/* Düzenle Butonları */}
                      {activeTab === 'sellers' ? (
                          <button onClick={() => openSellerEditModal(user.id)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Satıcıya Özel Düzenleme">
                             <Edit className="w-5 h-5" />
                          </button>
                      ) : activeTab === 'shoppers' ? (
                          <button onClick={() => openShopperEditModal(user.id)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Müşteri Detay Düzenleme">
                             <Edit className="w-5 h-5" />
                          </button>
                      ) : (
                          <button onClick={() => openEditModal(user)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Genel Düzenleme">
                             <Edit className="w-5 h-5" />
                          </button>
                      )}

                      <button onClick={() => handleDelete(user.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Sistemden Sil">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODALS */}
      {/* Admin Create Modal */}
      {showAdminModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in">
           <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
              <h3 className="font-bold text-lg mb-4 text-gray-800">Yeni Admin Ekle</h3>
              <form onSubmit={handleCreateAdmin} className="space-y-3">
                 <input type="text" placeholder="Kullanıcı Adı" required value={formData.username} onChange={e=>setFormData({...formData, username: e.target.value})} className="w-full px-3 py-2 border rounded focus:ring-2 outline-none"/>
                 <input type="email" placeholder="E-Posta" required value={formData.email} onChange={e=>setFormData({...formData, email: e.target.value})} className="w-full px-3 py-2 border rounded focus:ring-2 outline-none"/>
                 <input type="password" placeholder="Şifre" required value={formData.password} onChange={e=>setFormData({...formData, password: e.target.value})} className="w-full px-3 py-2 border rounded focus:ring-2 outline-none"/>
                 <div className="flex justify-end gap-2 mt-4">
                    <button type="button" onClick={() => setShowAdminModal(false)} className="px-4 py-2 text-gray-600 bg-gray-100 rounded">İptal</button>
                    <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Oluştur</button>
                 </div>
              </form>
           </div>
        </div>
      )}

      {/* Seller Create Modal */}
      {showSellerModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in">
           <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
              <h3 className="font-bold text-lg mb-4 text-gray-800">Yeni Satıcı Ekle</h3>
              <form onSubmit={handleCreateSeller} className="space-y-3">
                 <input type="text" placeholder="Kullanıcı Adı" required value={formData.username} onChange={e=>setFormData({...formData, username: e.target.value})} className="w-full px-3 py-2 border rounded focus:ring-2 outline-none"/>
                 <input type="email" placeholder="E-Posta" required value={formData.email} onChange={e=>setFormData({...formData, email: e.target.value})} className="w-full px-3 py-2 border rounded focus:ring-2 outline-none"/>
                 <input type="password" placeholder="Şifre" required value={formData.password} onChange={e=>setFormData({...formData, password: e.target.value})} className="w-full px-3 py-2 border rounded focus:ring-2 outline-none"/>
                 <input type="text" placeholder="Şirket Adı" required value={formData.companyName} onChange={e=>setFormData({...formData, companyName: e.target.value})} className="w-full px-3 py-2 border rounded focus:ring-2 outline-none"/>
                 <div className="flex justify-end gap-2 mt-4">
                    <button type="button" onClick={() => setShowSellerModal(false)} className="px-4 py-2 text-gray-600 bg-gray-100 rounded">İptal</button>
                    <button type="submit" className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700">Oluştur</button>
                 </div>
              </form>
           </div>
        </div>
      )}

      {/* Genel User Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in">
           <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
              <h3 className="font-bold text-lg mb-4 text-gray-800">Kullanıcı (Genel) Düzenle</h3>
              <form onSubmit={handleEditUser} className="space-y-3">
                 <input type="text" placeholder="Kullanıcı Adı" required value={formData.username} onChange={e=>setFormData({...formData, username: e.target.value})} className="w-full px-3 py-2 border rounded focus:ring-2 outline-none"/>
                 <input type="email" placeholder="E-Posta" required value={formData.email} onChange={e=>setFormData({...formData, email: e.target.value})} className="w-full px-3 py-2 border rounded focus:ring-2 outline-none"/>
                 <input type="password" placeholder="Yeni Şifre Belirle" required value={formData.password} onChange={e=>setFormData({...formData, password: e.target.value})} className="w-full px-3 py-2 border rounded focus:ring-2 outline-none"/>
                 <div className="flex justify-end gap-2 mt-4">
                    <button type="button" onClick={() => setShowEditModal(false)} className="px-4 py-2 text-gray-600 bg-gray-100 rounded">İptal</button>
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Güncelle</button>
                 </div>
              </form>
           </div>
        </div>
      )}

      {/* Seller Specific Edit Modal */}
      {showSellerEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in">
           <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 border-t-4 border-orange-500">
              <h3 className="font-bold text-lg mb-4 text-gray-800">Satıcı Doğrudan Düzenleme</h3>
              <p className="text-sm text-gray-500 mb-4 tracking-tight leading-snug">
                 <span className="font-bold text-orange-600">GET /api/admin/sellers/{"{id}"}</span> üzerinden çekildi ve 
                 <span className="font-bold text-blue-600"> PUT /api/admin/sellers/{"{id}"}</span> ucuyla güncellenecek.
              </p>
              <form onSubmit={handleEditSeller} className="space-y-3">
                 <input type="text" placeholder="Kullanıcı Adı" required value={formData.username} onChange={e=>setFormData({...formData, username: e.target.value})} className="w-full px-3 py-2 border rounded focus:ring-2 outline-none"/>
                 <input type="email" placeholder="E-Posta" required value={formData.email} onChange={e=>setFormData({...formData, email: e.target.value})} className="w-full px-3 py-2 border rounded focus:ring-2 outline-none"/>
                 <input type="text" placeholder="Şirket Adı" value={formData.companyName} onChange={e=>setFormData({...formData, companyName: e.target.value})} className="w-full px-3 py-2 border border-orange-200 rounded focus:ring-2 focus:ring-orange-500 outline-none bg-orange-50/30"/>
                 <div className="flex justify-end gap-2 mt-4">
                    <button type="button" onClick={() => setShowSellerEditModal(false)} className="px-4 py-2 text-gray-600 bg-gray-100 rounded">İptal</button>
                    <button type="submit" className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700">Satıcıyı Güncelle</button>
                 </div>
              </form>
           </div>
        </div>
      )}

      {/* Shopper Specific Edit Modal */}
      {showShopperEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in">
           <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 border-t-4 border-green-500">
              <h3 className="font-bold text-lg mb-4 text-gray-800">Müşteri (Shopper) Detay Düzenleme</h3>
              <p className="text-sm text-gray-500 mb-4 tracking-tight leading-snug">
                 <span className="font-bold text-green-600">PUT /api/admin/shoppers/{"{id}"}/details</span> ucuyla sadece İsim-Soyisim güncellenecek.
              </p>
              <form onSubmit={handleEditShopperDetails} className="space-y-3">
                 <input type="text" placeholder="Ad (First Name)" required value={formData.firstName} onChange={e=>setFormData({...formData, firstName: e.target.value})} className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-500 outline-none"/>
                 <input type="text" placeholder="Soyad (Last Name)" required value={formData.lastName} onChange={e=>setFormData({...formData, lastName: e.target.value})} className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-500 outline-none"/>
                 <div className="flex justify-end gap-2 mt-4">
                    <button type="button" onClick={() => setShowShopperEditModal(false)} className="px-4 py-2 text-gray-600 bg-gray-100 rounded">İptal</button>
                    <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Müşteriyi Güncelle</button>
                 </div>
              </form>
           </div>
        </div>
      )}

      {/* Seller Items Display Modal */}
      {showItemsModal && (
        <div className="fixed inset-0 bg-black/50 flex flex-col items-center justify-center p-4 z-50 animate-in zoom-in-95">
           <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/80">
                 <h3 className="font-bold text-lg text-gray-800">Satıcı Cüzdanı / İlanları</h3>
                 <button onClick={() => setShowItemsModal(false)} className="text-gray-400 hover:text-gray-800 text-2xl font-bold leading-none">&times;</button>
              </div>
              <div className="p-4 overflow-y-auto flex-1">
                 {itemsLoading ? (
                    <div className="text-center py-10 text-gray-500">Vitrin İçerikleri Alınıyor...</div>
                 ) : sellerItems.length === 0 ? (
                    <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-lg">Bu satıcının vitrininde ürün bulunamadı.</div>
                 ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       {sellerItems.map(item => (
                          <div key={item.id} className="bg-white border border-gray-100 shadow-sm rounded-lg p-3 flex gap-4 items-center">
                             {item.images && item.images.length > 0 ? (
                               <img src={item.images[0]} alt={item.title} className="w-16 h-16 object-cover rounded-md border border-gray-200" />
                             ) : (
                               <div className="w-16 h-16 bg-gray-100 flex items-center justify-center rounded-md">
                                  <Package className="w-6 h-6 text-gray-400" />
                               </div>
                             )}
                             <div>
                                <h4 className="font-semibold text-gray-800 truncate max-w-[150px]" title={item.title}>{item.title}</h4>
                                <div className="text-purple-600 font-bold mt-1 text-sm">{item.price != null ? `${item.price} ₺` : '-'}</div>
                             </div>
                          </div>
                       ))}
                    </div>
                 )}
              </div>
           </div>
        </div>
      )}

    </div>
  );
};

export default AdminUsers;
