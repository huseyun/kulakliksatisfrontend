import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  sub: string; // username
  roles: string[];
  exp: number;
}

interface AuthState {
  token: string | null;
  username: string | null;
  roles: string[];
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const getInitialState = () => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem('token');
        return { token: null, username: null, roles: [], isAuthenticated: false };
      }
      const processedRoles = (decoded.roles || []).map((r: string) => r.startsWith('ROLE_') ? r.substring(5) : r);
      return { token, username: decoded.sub, roles: processedRoles, isAuthenticated: true };
    } catch {
      localStorage.removeItem('token');
    }
  }
  return { token: null, username: null, roles: [], isAuthenticated: false };
};

export const useAuthStore = create<AuthState>((set) => ({
  ...getInitialState(),
  login: (token: string) => {
    localStorage.setItem('token', token);
    const decoded = jwtDecode<DecodedToken>(token);
    const processedRoles = (decoded.roles || []).map((r: string) => r.startsWith('ROLE_') ? r.substring(5) : r);
    set({
      token,
      username: decoded.sub,
      roles: processedRoles,
      isAuthenticated: true,
    });
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, username: null, roles: [], isAuthenticated: false });
  },
}));
