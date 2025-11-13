import { createContext } from 'react';
import type { UserType } from '../userType';

type UserContext = {
  user: UserType | undefined;
  setUser: (user: UserType | undefined) => void;
};

export const UserContext = createContext<UserContext>({
  user: undefined,
  setUser: () => {},
});
