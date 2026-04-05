import { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { type ItemSummaryResponse } from '../../types';
import { Image as ImageIcon, Box } from 'lucide-react';

export const AdminItems = () => {
  const [items, setItems] = useState<ItemSummaryResponse[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get('/api/items');
      if (Array.isArray(response.data)) {
         setItems(response.data);
      } else if (response.data && typeof response.data === 'object' && 'content' in response.data) {
         setItems(response.data.content);
      } else {
         setItems(response.data ? [response.data] : []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Sistemdeki Tüm Ürünler</h2>
        <p className="text-gray-500 text-sm mt-1">Platformda satıcılar tarafından listelenen bütün kulaklıkları görüntüleyebilirsiniz.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Yükleniyor...</div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center text-gray-500 flex flex-col items-center">
            <Box className="w-12 h-12 text-gray-300 mb-3" />
            <p>Sistemde henüz aktif bir ürün bulunmuyor.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-100">
                  <th className="p-4 font-semibold w-24">Görsel</th>
                  <th className="p-4 font-semibold">ID</th>
                  <th className="p-4 font-semibold">Başlık (Title)</th>
                  <th className="p-4 font-semibold">Fiyat</th>
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
                    <td className="p-4 font-mono text-xs text-gray-500">{item.id}</td>
                    <td className="p-4 font-medium text-gray-800">{item.title}</td>
                    <td className="p-4 text-purple-600 font-semibold">{item.price != null ? `${item.price} ₺` : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminItems;
