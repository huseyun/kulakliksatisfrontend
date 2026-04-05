import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { type ItemSummaryResponse } from '../../types';
import { Search, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';

export const Home = () => {
  const [items, setItems] = useState<ItemSummaryResponse[]>([]);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchItems = async (searchQuery = '') => {
    setLoading(true);
    try {
      const endpoint = searchQuery.trim() !== '' 
        ? `/api/items/search?keyword=${encodeURIComponent(searchQuery)}`
        : '/api/items';
        
      const response = await axiosClient.get<ItemSummaryResponse[]>(endpoint);
      setItems(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchItems(keyword);
  };

  return (
    <div className="p-8">
      {/* Hero / Search Section */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">Kulaklık Dünyasına Hoş Geldiniz</h1>
        <p className="text-gray-500 mb-6 max-w-xl mx-auto">En iyi markaların seçkin kulaklık modellerini keşfedin. İhtiyacınıza en uygun olanı bulmak için arama yapabilirsiniz.</p>
        
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative flex items-center">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Kulaklık ara..."
            className="w-full pl-5 pr-14 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-sm transition-all"
          />
          <button 
            type="submit" 
            className="absolute right-2 p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>
        </form>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="text-center text-gray-500 py-10 fade-in">Yükleniyor...</div>
      ) : items.length === 0 ? (
        <div className="text-center text-gray-500 py-10 bg-white rounded-xl border border-gray-100">Aradığınız kriterlere uygun ürün bulunamadı.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 fade-in">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
              <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                {item.images && item.images.length > 0 ? (
                  <img src={item.images[0]} alt={item.title} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <ShoppingCart className="w-16 h-16 text-gray-300" />
                )}
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-gray-800 text-lg mb-1 truncate">{item.title}</h3>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-purple-600 font-bold text-xl">{item.price} ₺</span>
                  <button onClick={() => toast("Sepet özelliği eklenecek!")} className="text-sm px-3 py-1.5 bg-gray-50 hover:bg-purple-50 text-purple-600 font-medium rounded-lg transition-colors">
                    İncele
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
