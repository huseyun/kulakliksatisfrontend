import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { useAuthStore } from '../../store/useAuthStore';
import toast from 'react-hot-toast';

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const loginAction = useAuthStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axiosClient.post('/api/auth/login', { username, password });
      
      const tokenObject = response.data;
      const tokenString = typeof tokenObject === 'string' ? tokenObject : tokenObject.token;
      
      if (tokenString) {
        loginAction(tokenString);
        toast.success("Giriş başarılı!");
        
        // Yönlendirme mantığı (Auth Store Güncel)
        const updatedRoles = useAuthStore.getState().roles;
        
        if (updatedRoles.includes("ADMIN")) {
          navigate("/admin");
        } else if (updatedRoles.includes("SELLER")) {
          navigate("/seller");
        } else {
          // SHOPPER ya da USER
          navigate("/");
        }
      } else {
        toast.error("Geçersiz yanıt formatı.");
      }
    } catch (err) {
      // Axios interceptor handles toast notifications automatically.
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-100">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          Sisteme Giriş Yap
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kullanıcı Adı
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
              placeholder="Username"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Şifre
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white font-medium py-2.5 px-4 rounded-lg hover:bg-purple-700 transition-colors focus:ring-4 focus:ring-purple-200 mt-4 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500">
          Hesabınız yok mu? <Link to="/register" className="text-purple-600 hover:text-purple-700 font-medium hover:underline">Kayıt Ol</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
