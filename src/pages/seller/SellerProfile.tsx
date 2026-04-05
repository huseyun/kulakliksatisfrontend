import React, { useState } from 'react';
import axiosClient from '../../api/axiosClient';
import toast from 'react-hot-toast';
import { Store } from 'lucide-react';
import PasswordChangeForm from '../../components/PasswordChangeForm';

export const SellerProfile = () => {
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosClient.put('/api/sellers', { companyName });
      toast.success('Şirket bilgileriniz güncellendi.');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in max-w-2xl mx-auto">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-full">
            <Store className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Şirket Profili</h2>
            <p className="text-gray-500 text-sm">Şirket adınızı buradan güncelleyebilirsiniz.</p>
          </div>
        </div>

        <form onSubmit={handleUpdate} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Şirket Adı
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
              placeholder="Yeni şirket adı"
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:bg-white outline-none transition-all"
            />
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-purple-600 text-white font-medium py-2.5 px-6 rounded-lg hover:bg-purple-700 transition-colors focus:ring-4 focus:ring-purple-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Kaydediliyor..." : "Güncelle"}
            </button>
          </div>
        </form>
      </div>
      
      <PasswordChangeForm />
    </div>
  );
};

export default SellerProfile;
