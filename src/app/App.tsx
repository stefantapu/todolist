import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import './App.css';
import AppBar from '../shared/ui-kit/AppBar.tsx';
import {
  Button,
  Container,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { PasswordRounded } from '@mui/icons-material';
import { jwtDecode } from 'jwt-decode';
import { useState, useMemo, useEffect } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

const App = () => {
  // COLOR SCHEME
  const [mode, setMode] = useState<'light' | 'dark'>(
    (localStorage.getItem('theme') as 'light' | 'dark') || 'light'
  );
  useEffect(() => {
    localStorage.setItem('theme', mode);
  }, [mode]);
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  );
  const toggleTheme = () => {
    setMode(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // USER
  const [user, setUser] = useState<{
    access_token: string;
    username: string;
  } | null>(null);
  const [loginFormName, setLoginFormName] = useState<'login' | 'register'>(
    'login'
  );
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleLoginFormChange = (
    _: React.MouseEvent<HTMLElement>,
    newForm: 'login' | 'register'
  ) => {
    if (newForm) setLoginFormName(newForm);
  };

  // USER LOGIN
  const handleLogin = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      const response = await fetch('https://todos-be.vercel.app/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        // show exactly what the server sent
        throw new Error(data?.message || `Login failed (${response.status})`);
      }

      if (!data.access_token) throw new Error('Server did not return a token.');

      const decoded = jwtDecode(data.access_token);
      console.log('Decoded token:', decoded);

      localStorage.setItem('accessToken', data.access_token);
      setUser(data);
    } catch (error) {
      setErrorMessage((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  // USER REGISTER
  const handleRegister = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      const response = await fetch(
        'https://todos-be.vercel.app/auth/register',
        {
          method: 'POST',
          body: JSON.stringify({ username, password }),
          mode: 'cors',
          headers: {
            'Content-type': 'application/json',
          },
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.message);
      }
      if (!data.access_token) {
        throw new Error('Server did not return a token.');
      }

      localStorage.setItem('accessToken', data.access_token);
      setUser(data);
    } catch (error) {
      setErrorMessage((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar toggleTheme={toggleTheme} mode={mode} username={user?.username} />
      <Container
        maxWidth="sm"
        sx={{
          justifyContent: 'center',
          alignItems: 'center',
          alignContent: 'center',
          minHeight: '100vh',
        }}
      >
        <Paper elevation={3} sx={{ padding: 5 }}>
          <Stack
            direction="column"
            spacing={2}
            sx={{
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <ToggleButtonGroup
              value={loginFormName}
              exclusive
              onChange={handleLoginFormChange}
              disabled={isLoading}
              fullWidth
            >
              <ToggleButton value="login" size="small">
                Login
              </ToggleButton>
              <ToggleButton value="register" size="small">
                Register
              </ToggleButton>
            </ToggleButtonGroup>

            <TextField
              label="E-mail"
              type="email"
              fullWidth
              value={username}
              onChange={handleUsernameChange}
              disabled={isLoading}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircle />
                    </InputAdornment>
                  ),
                },
              }}
              variant="outlined"
              size="small"
            />
            <TextField
              label="Пароль"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              disabled={isLoading}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PasswordRounded />
                    </InputAdornment>
                  ),
                },
              }}
              variant="outlined"
              size="small"
              fullWidth
            />

            {errorMessage && (
              <Typography color="error" variant="body2" textAlign="center">
                {errorMessage}
              </Typography>
            )}

            <Button
              onClick={loginFormName === 'login' ? handleLogin : handleRegister}
              loading={isLoading}
              variant="contained"
              fullWidth
              sx={{
                backgroundColor:
                  loginFormName === 'login' ? '#1976d2' : '#3ecd3eff',
              }}
            >
              {loginFormName === 'login' ? 'Login' : 'Register'}
            </Button>
          </Stack>
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default App;
