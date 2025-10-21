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
import { useState } from 'react';

const App = () => {
  const [loginFormName, setLoginFormName] = useState<'login' | 'register'>(
    'login'
  );
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSubmit = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      console.log({ username, password, form: loginFormName });
    }, 2000);
  };

  return (
    <>
      <AppBar />
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
            <Typography variant="h5" gutterBottom>
              {loginFormName === 'login' ? 'Вход' : 'Регистрация'}
            </Typography>
            <ToggleButtonGroup
              value={loginFormName}
              exclusive
              onChange={handleLoginFormChange}
              disabled={isLoading}
              fullWidth
            >
              <ToggleButton value="login" size="small">
                Вход
              </ToggleButton>
              <ToggleButton value="register" size="small">
                Регистрация
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
            <Button
              onClick={handleSubmit}
              loading={isLoading}
              variant="contained"
              fullWidth
              sx={{
                backgroundColor:
                  loginFormName === 'login' ? '#1976d2' : '#3ecd3eff',
              }}
            >
              {loginFormName === 'login' ? 'Войти' : 'Зарегистрироваться'}
            </Button>
          </Stack>
        </Paper>
      </Container>
    </>
  );
};

export default App;
