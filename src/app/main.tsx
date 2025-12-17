import { createRoot } from 'react-dom/client';
import './index.css';
import { Provider } from 'react-redux';
import { SnackbarProvider } from 'notistack';
import { ThemeProviderCustom } from './ThemeProviderCustom.tsx';
import AppRoutes from './appRoutes.tsx';
import { store } from './store.ts';

createRoot(document.getElementById('root')!).render(
  <>
    <Provider store={store}>
      <SnackbarProvider>
        <ThemeProviderCustom>
          <AppRoutes />
        </ThemeProviderCustom>
      </SnackbarProvider>
    </Provider>
  </>
);
