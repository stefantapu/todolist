import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './App.css';

import Auth from '../entities/User/ui/Auth.tsx';
import { ThemeProviderCustom } from './ThemeProviderCustom.tsx';
import Todos from '../entities/Todo/ui/Todos.tsx';
import { SnackbarProvider } from 'notistack';
import { store, useAppSelector } from './store.ts';
import { Provider } from 'react-redux';
import { selectUser } from '../entities/User/model/store/userStore.ts';
import AppRoutes from './appRoutes.tsx';

export const AppContent = () => {
  const user = useAppSelector(selectUser);

  return <>{user ? <Todos /> : <Auth />}</>;
};

const App = () => (
  <Provider store={store}>
    <SnackbarProvider>
      <ThemeProviderCustom>
        <AppRoutes />
      </ThemeProviderCustom>
    </SnackbarProvider>
  </Provider>
);

export default App;
