import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './App.css';

import AppBar from '../shared/ui-kit/AppBar.tsx';
import Auth from '../entities/User/ui/Auth.tsx';
import { ThemeProviderCustom, useThemeMode } from './ThemeProviderCustom.tsx';
import Todos from '../entities/Todo/ui/Todos.tsx';
import { SnackbarProvider } from 'notistack';
import { UserProvider } from '../entities/User/model/provider/UserProvider.tsx';
import { UserContext } from '../entities/User/model/provider/UserContext.tsx';
import { useContext } from 'react';

const AppContent = () => {
  const { mode, toggleTheme } = useThemeMode();
  const userContext = useContext(UserContext);
  const user = userContext.user;

  // const setUser = userContext.setUser;

  return (
    <>
      <AppBar toggleTheme={toggleTheme} mode={mode} />
      {user ? (
        <Todos />
      ) : (
        <Auth
        // onAuthSuccess={setUser}
        />
      )}
    </>
  );
};

const App = () => (
  <UserProvider>
    <SnackbarProvider>
      <ThemeProviderCustom>
        <AppContent />
      </ThemeProviderCustom>
    </SnackbarProvider>
  </UserProvider>
);

export default App;
