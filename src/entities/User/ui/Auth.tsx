import {
  Button,
  Container,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { PasswordRounded } from '@mui/icons-material';
import { useState } from 'react';
import { rootApi } from '../../../shared/api/rootApi';
import type { UserType } from '../model/userType';
import { useSnackbar } from 'notistack';
import type { AxiosError } from 'axios';
import { useAuthStore } from '../model/store/useAuthStore';
import { useUserStore } from '../model/provider/UserContext';

// Компонент Auth отвечает за отображение формы авторизации и регистрации.
// Принимает проп onAuthSuccess — функцию, вызываемую при успешной авторизации пользователя.
const Auth = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [loginFormName, setLoginFormName] = useState<'login' | 'register'>(
    'login'
  );
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const setAuth = useAuthStore(state => state.setAuth); // Получите функцию setAuth из store
  const { setUser } = useUserStore();

  // handleSubmit — обработчик отправки формы (авторизация или регистрация)
  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const url = loginFormName === 'login' ? 'auth/login' : 'auth/register';
      const loginData = await rootApi.post<UserType>(url, {
        username,
        password,
      });
      const accessToken = loginData.data.access_token;

      // Сохраняем токен в Zustand store
      setAuth(accessToken, loginData.data.username);
      localStorage.setItem('access_token', accessToken);
      setUser(loginData.data);
      enqueueSnackbar('Welcome!', { variant: 'success' });
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      enqueueSnackbar(axiosError.response?.data.message, { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        height: '90vh',
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
          {/* Переключатель между формой входа и регистрации */}
          <ToggleButtonGroup
            value={loginFormName}
            exclusive
            onChange={(_, newForm) => newForm && setLoginFormName(newForm)}
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
          {/* Поле для ввода email/имени пользователя */}
          <TextField
            label="E-mail"
            type="email"
            fullWidth
            value={username}
            onChange={e => setUsername(e.target.value)}
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
          {/* Поле для ввода пароля */}
          <TextField
            label="Password"
            type="password"
            fullWidth
            value={password}
            onChange={e => setPassword(e.target.value)}
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
          />
          {/* Кнопка отправки формы */}
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={isLoading}
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
  );
};

export default Auth;
