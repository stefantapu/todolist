import { jwtDecode, type JwtPayload } from 'jwt-decode';
import { useAppSelector } from '../../app/store';
import { selectUser } from '../../entities/User/model/store/userStore';

export const useAutoLogin = () => {
  const user = useAppSelector(selectUser);
  const token = user?.access_token;

  if (token) {
    try {
      const decodedToken = jwtDecode<JwtPayload & { username: string }>(token);

      if (decodedToken.exp && decodedToken.exp * 1000 >= Date.now()) {
        return { username: decodedToken.username, access_token: token };
      }
      localStorage.removeItem('access_token');
      return undefined;
    } catch (error) {
      console.error(error);
      localStorage.removeItem('access_token');
      return undefined;
    }
  }
  return undefined;
};
