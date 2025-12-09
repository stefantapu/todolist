import { jwtDecode, type JwtPayload } from 'jwt-decode';

export const loadUserFromLS = () => {
  const token = localStorage.getItem('access_token');
  if (!token) return null;

  try {
    const decoded = jwtDecode<JwtPayload & { username: string }>(token);

    if (decoded.exp && decoded.exp * 1000 >= Date.now()) {
      return {
        username: decoded.username,
        access_token: token,
      };
    }

    localStorage.removeItem('access_token');
    return null;
  } catch {
    localStorage.removeItem('access_token');
    return null;
  }
};
