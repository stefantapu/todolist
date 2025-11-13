import { useState, type PropsWithChildren } from 'react';
import { autoLogin } from '../../../../shared/util/autoLogin';
import type { UserType } from '../userType';
import { UserContext } from './UserContext';

export const UserProvider = ({ children }: PropsWithChildren) => {
  const userFromLS = autoLogin();
  const [user, setUser] = useState<UserType | undefined>(userFromLS);

  const handleSetUser = (user?: UserType) => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
    } else {
      localStorage.removeItem('user');
      setUser(undefined);
    }
  };
  return (
    <UserContext.Provider value={{ user: user, setUser: handleSetUser }}>
      {children}
    </UserContext.Provider>
  );
};
