import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { type ItemSummaryResponse } from '../../types';
import toast from 'react-hot-toast';
import { Plus, Trash2, Image as ImageIcon } from 'lucide-react';

export const SellerItems = () => {
  const [items, setItems] = useState<ItemSummaryResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingId, setEditingId] = useState<string | number | null>(null);
  
  // Create Form State
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [brand, setBrand] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [smallImageUrl, setSmallImageUrl] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axiosClient.get<ItemSummaryResponse[]>('/api/sellers/me/items');
      setItems(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!window.confirm('Bu ürünü silmek istediğinize emin misiniz?')) return;
    try {
      await axiosClient.delete(`/api/items/${id}`);
      toast.success('Ürün silindi.');
      fetchItems();
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (modalMode === 'create') {
        // 1. Create Base Item
        const response = await axiosClient.post('/api/items', {
          name, title, brand, description
        });
        const newItemId = response.data.id;
        
        // 2. Add Image if provided
        if ((imageUrl || smallImageUrl) && newItemId) {
           await axiosClient.post(`/api/items/${newItemId}/images`, {
              smallImageUrl: smallImageUrl || imageUrl, imageUrl: imageUrl || smallImageUrl
           });
        }
        toast.success('Ürün başarıyla eklendi!');
      } else {
        // Edit Item
        await axiosClient.put(`/api/items/${editingId}`, {
          name, title, brand, description
        });
        
        // Add Image if provided during edit
        if ((imageUrl || smallImageUrl) && editingId) {
           await axiosClient.post(`/api/items/${editingId}/images`, {
              smallImageUrl: smallImageUrl || imageUrl, imageUrl: imageUrl || smallImageUrl
           });
        }
        
        toast.success('Ürün güncelleme başarılı!');
      }

      setShowModal(false);
      resetForm();
      fetchItems();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = async (id: string | number) => {
    setModalMode('edit');
    setEditingId(id);
    setLoading(true);
    resetForm();
    try {
      const response = await axiosClient.get(`/api/items/${id}`);
      const data = response.data;
      // Pre-populate Form. Note: backend ItemResponse might lack some fields, use fallback
      setTitle(data.title || '');
      setDescription(data.description || '');
      // Name and Brand are required by PUT but might not exist in GET DTO.
      setName((data as any).name || '');
      setBrand((data as any).brand || '');
      setShowModal(true);
    } catch (error) {
      console.error(error);
      toast.error('Ürün detayları alınamadı.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setTitle('');
    setBrand('');
    setDescription('');
    setImageUrl('');
    setSmallImageUrl('');
  };

  return (
    <div className="animate-in fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Ürünlerim</h2>
          <p className="text-gray-500 text-sm mt-1">Sisteme kayıtlı ürünlerinizi yönetin.</p>
        </div>
        <button 
          onClick={() => { setModalMode('create'); resetForm(); setShowModal(true); }}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-5 h-5" /> Yeni Ürün Ekle
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {items.length === 0 ? (
           <div className="p-8 text-center text-gray-500">Henüz hiç ürün eklemediniz.</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-100">
                <th className="p-4 font-semibold">Görsel</th>
                <th className="p-4 font-semibold">Başlık (Title)</th>
                <th className="p-4 font-semibold">Fiyat</th>
                <th className="p-4 flex justify-end font-semibold text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    {item.images && item.images.length > 0 ? (
                      <img src={item.images[0]} alt={item.title} className="w-12 h-12 rounded object-cover border border-gray-200" />
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-gray-400">
                         <ImageIcon className="w-5 h-5" />
                      </div>
                    )}
                  </td>
                  <td className="p-4 font-medium text-gray-800">{item.title}</td>
                  <td className="p-4 text-purple-600 font-semibold">{item.price != null ? item.price + ' ₺' : '-'}</td>
                  <td className="p-4 flex justify-end gap-2">
                    <button 
                      onClick={() => openEditModal(item.id)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium text-sm"
                      title="Düzenle"
                    >
                      Düzenle
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Sil"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-2xl">
              <h3 className="font-bold text-lg text-gray-800">
                {modalMode === 'create' ? 'Yeni Ürün Ekle' : 'Ürünü Düzenle'}
              </h3>
              <button type="button" onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kısa İsim (Name)</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Marka</label>
                  <input type="text" value={brand} onChange={e => setBrand(e.target.value)} required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Başlık (Title)</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                     {modalMode === 'create' ? 'Küçük Görsel URL (Önizleme)' : 'Yeni Küçük Görsel (Önizleme)'}
                  </label>
                  <input type="url" value={smallImageUrl} onChange={e => setSmallImageUrl(e.target.value)} placeholder="https://..." className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                     {modalMode === 'create' ? 'Büyük Görsel URL (Detay)' : 'Yeni Büyük Görsel (Detay)'}
                  </label>
                  <input type="url" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://..." className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors">İptal</button>
                <button type="submit" disabled={loading} className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors disabled:opacity-70">
                  {loading ? 'İşleniyor...' : (modalMode === 'create' ? 'Ekle' : 'Güncelle')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerItems;
