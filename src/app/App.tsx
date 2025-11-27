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
import { store, useAppSelector } from './store.ts';
import { Provider } from 'react-redux';

const AppContent = () => {
  const { mode, toggleTheme } = useThemeMode();
  const user = useAppSelector(state => state.userSlice.user);

  return (
    <>
      <AppBar toggleTheme={toggleTheme} mode={mode} />
      {user ? <Todos /> : <Auth />}
    </>
  );
};

const App = () => (
  <Provider store={store}>
    <UserProvider>
      <SnackbarProvider>
        <ThemeProviderCustom>
          <AppContent />
        </ThemeProviderCustom>
      </SnackbarProvider>
    </UserProvider>
  </Provider>
);

export default App;
