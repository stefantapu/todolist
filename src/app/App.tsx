import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './App.css';

import { ThemeProviderCustom } from './ThemeProviderCustom.tsx';
import { SnackbarProvider } from 'notistack';
import { store } from './store.ts';
import { Provider } from 'react-redux';
import AppRoutes from './appRoutes.tsx';

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
