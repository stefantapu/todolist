import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './App.css';

import { useEffect, useMemo, useState } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import AppBar from '../shared/ui-kit/AppBar.tsx';
import Auth from './Auth.tsx';

const App = () => {
  const [mode, setMode] = useState<'light' | 'dark'>(
    (localStorage.getItem('theme') as 'light' | 'dark') || 'light'
  );
  const [user, setUser] = useState<{
    access_token: string;
    username: string;
  } | null>(null);

  const theme = useMemo(() => createTheme({ palette: { mode } }), [mode]);
  const toggleTheme = () =>
    setMode(prev => (prev === 'light' ? 'dark' : 'light'));

  useEffect(() => {
    localStorage.setItem('theme', mode);
  }, [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar toggleTheme={toggleTheme} mode={mode} username={user?.username} />
      {!user && <Auth onAuthSuccess={setUser} />}
      {user && <div>Добро пожаловать, {user.username}!</div>}
    </ThemeProvider>
  );
};

export default App;
