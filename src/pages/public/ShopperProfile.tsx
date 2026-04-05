import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { useAuthStore } from '../../store/useAuthStore';
import { type ShopperResponse } from '../../types';
import toast from 'react-hot-toast';
import { UserCircle } from 'lucide-react';
import PasswordChangeForm from '../../components/PasswordChangeForm';

export const ShopperProfile = () => {
  const [shopper, setShopper] = useState<ShopperResponse | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axiosClient.get<ShopperResponse>('/api/shoppers/me');
      setShopper(response.data);
      setFirstName(response.data.firstName || '');
      setLastName(response.data.lastName || '');
    } catch (error) {
      console.error(error);
    } finally {
      setFetching(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosClient.put('/api/shoppers/me', { firstName, lastName });
      toast.success('Profil bilgileriniz güncellendi.');
      fetchProfile(); // refresh data
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="p-8 text-center text-gray-500">Yükleniyor...</div>;
  }

  return (
    <div className="p-8 animate-in fade-in max-w-2xl mx-auto">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-full">
            <UserCircle className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Hesabım</h2>
            <p className="text-gray-500 text-sm">Profil bilgilerinizi buradan yönetebilirsiniz.</p>
          </div>
        </div>

        <form onSubmit={handleUpdate} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Adınız
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:bg-white outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Soyadınız
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:bg-white outline-none transition-all"
              />
            </div>
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">
               Kullanıcı Adı
             </label>
             <input
               type="text"
               value={shopper?.username || ''}
               disabled
               className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
             />
          </div>
          
          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">
               E-Posta
             </label>
             <input
               type="email"
               value={shopper?.email || ''}
               disabled
               className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
             />
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-purple-600 text-white font-medium py-2.5 px-6 rounded-lg hover:bg-purple-700 transition-colors focus:ring-4 focus:ring-purple-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
            </button>
          </div>
        </form>
      </div>
      
      <PasswordChangeForm />
    </div>
  );
};

export default ShopperProfile;
