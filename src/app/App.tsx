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
import { store, useAppSelector } from './store.ts';
import { Provider } from 'react-redux';
import { selectUser } from '../entities/User/model/store/userStore.ts';

const AppContent = () => {
  const { mode, toggleTheme } = useThemeMode();
  const user = useAppSelector(selectUser);

  return (
    <>
      <AppBar toggleTheme={toggleTheme} mode={mode} />
      {user ? <Todos /> : <Auth />}
    </>
  );
};

const App = () => (
  <Provider store={store}>
    <SnackbarProvider>
      <ThemeProviderCustom>
        <AppContent />
      </ThemeProviderCustom>
    </SnackbarProvider>
  </Provider>
);

export default App;
