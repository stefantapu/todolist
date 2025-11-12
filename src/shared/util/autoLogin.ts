import { jwtDecode, type JwtPayload } from 'jwt-decode';
import { useAuthStore } from '../../entities/User/model/store/useAuthStore'; // Импортируйте store

export const autoLogin = () => {
  const token = localStorage.getItem('access_token');

  if (token) {
    try {
      const decodedToken = jwtDecode<JwtPayload & { username: string }>(token);

      if (decodedToken.exp && decodedToken.exp * 1000 >= Date.now()) {
        // Устанавливаем состояние аутентификации в Zustand
        useAuthStore.getState().setAuth(token, decodedToken.username);
        return { username: decodedToken.username, access_token: token };
      }
      localStorage.removeItem('access_token');
      return null;
    } catch (error) {
      console.error(error);
      localStorage.removeItem('access_token');
      return null;
    }
  }
  return null;
};
