import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { createTheme, CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  colorSchemes: {
    light: true,
  },
});

createRoot(document.getElementById('root')!).render(
  <>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </>
);
