import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './App.css';

import { useState } from 'react';
import AppBar from '../shared/ui-kit/AppBar.tsx';
import Auth from '../entities/User/ui/Auth.tsx';
import { ThemeProviderCustom, useThemeMode } from './ThemeProviderCustom.tsx';
import type { UserType } from '../entities/User/model/userType.ts';
import Todos from '../entities/Todo/ui/Todos.tsx';
import { autoLogin } from '../shared/util/autoLogin.ts';
import { SnackbarProvider } from 'notistack';

const AppContent = () => {
  const userFromLS = autoLogin();
  const [user, setUser] = useState<UserType | null>(userFromLS);
  const { mode, toggleTheme } = useThemeMode();

  console.log('user:', user);

  return (
    <>
      <AppBar toggleTheme={toggleTheme} mode={mode} username={user?.username} />
      {user ? <Todos /> : <Auth onAuthSuccess={setUser} />}
    </>
  );
};

const App = () => (
  <SnackbarProvider>
    <ThemeProviderCustom>
      <AppContent />
    </ThemeProviderCustom>
  </SnackbarProvider>
);

export default App;
