import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './App.css';

import { ThemeProviderCustom } from './ThemeProviderCustom.tsx';
import { SnackbarProvider } from 'notistack';
import { store, useAppSelector } from './store.ts';
import { Provider } from 'react-redux';
import { selectUser } from '../entities/User/model/store/userStore.ts';
import AppRoutes from './appRoutes.tsx';
import { Navigate } from 'react-router-dom';
import Todos from '../entities/Todo/ui/Todos.tsx';

export const AppContent = () => {
  const user = useAppSelector(selectUser);

  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  return <Todos />;
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
