import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './App.css';

import { useState } from 'react';
import { Typography } from '@mui/material';
import AppBar from '../shared/ui-kit/AppBar.tsx';
import Auth from './Auth.tsx';
import { ThemeProviderCustom, useThemeMode } from './ThemeProviderCustom.tsx';

const AppContent = () => {
  const [user, setUser] = useState<{
    access_token: string;
    username: string;
  } | null>(null);
  const { mode, toggleTheme } = useThemeMode();

  console.log('user:', user);

  return (
    <>
      <AppBar toggleTheme={toggleTheme} mode={mode} username={user?.username} />
      {!user && <Auth onAuthSuccess={setUser} />}
      {user && (
        <Typography textAlign="center">
          Добро пожаловать, {user.username}!
        </Typography>
      )}
    </>
  );
};

const App = () => (
  <ThemeProviderCustom>
    <AppContent />
  </ThemeProviderCustom>
);

export default App;
