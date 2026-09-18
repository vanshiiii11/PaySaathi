import { useAuthStore } from '../store/auth.store';
import { api } from '../services/api';

export const useAuth = () => {
  const { user, isAuthenticated, setAuth, clearAuth, updateUser } = useAuthStore();

  const login = async (phone: string, otp: string) => {
    try {
      const response = await api.post('/auth/otp/verify', { phone, otp });
      setAuth(response.data.user, response.data.accessToken);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    clearAuth();
  };

  const updateProfile = async (data: any) => {
    try {
      const response = await api.patch('/users/me', data);
      updateUser(response.data);
    } catch (error) {
      throw error;
    }
  };

  return { user, isAuthenticated, login, logout, updateProfile };
};
