import React, { useState } from 'react';
import axiosClient from '../api/axiosClient';
import toast from 'react-hot-toast';

export const PasswordChangeForm = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Şifreler eşleşmiyor.");
      return;
    }
    
    setLoading(true);
    try {
      await axiosClient.put('/api/users', { password });
      toast.success("Şifreniz başarıyla güncellendi.");
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-8">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Şifre Değiştir</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Yeni Şifre</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
            placeholder="••••••••"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Yeni Şifre (Sıfırla)</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
            placeholder="••••••••"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading || !password}
          className="bg-gray-800 text-white font-medium py-2 px-6 rounded-lg hover:bg-gray-900 transition-colors focus:ring-4 focus:ring-gray-200 disabled:opacity-50"
        >
          {loading ? "Güncelleniyor..." : "Şifreyi Güncelle"}
        </button>
      </form>
    </div>
  );
};

export default PasswordChangeForm;
