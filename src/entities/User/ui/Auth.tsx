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
import {
  selectIsLoading,
  selectUser,
  setIsLoading,
  setUser,
} from '../model/store/userStore';
import { useAppDispatch, useAppSelector } from '../../../app/store';
import { Navigate, useNavigate } from 'react-router-dom';

const Auth = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [loginFormName, setLoginFormName] = useState<'login' | 'register'>(
    'login'
  );
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectIsLoading);
  const navigate = useNavigate();

  const user = useAppSelector(selectUser);

  const handleSubmit = async () => {
    dispatch(setIsLoading(true));
    try {
      const url = loginFormName === 'login' ? 'auth/login' : 'auth/register';
      const loginData = await rootApi.post<UserType>(url, {
        username,
        password,
      });

      // Persist user in redux
      dispatch(setUser(loginData.data));
      // Also persist token (and user) in localStorage so the session can survive reloads
      try {
        localStorage.setItem('access_token', loginData.data.access_token);
        localStorage.setItem('user', JSON.stringify(loginData.data));
      } catch (e) {
        // Quieten any localStorage errors (e.g., storage disabled)
        console.error('Failed to persist user to localStorage', e);
      }

      enqueueSnackbar('Welcome!', { variant: 'success' });
      navigate('/');
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      enqueueSnackbar(axiosError.response?.data.message, { variant: 'error' });
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  if (user) {
    return <Navigate to="/"></Navigate>;
  }

  if (error) {
    throw new Error('Error');
  }

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
          <Button
            variant="contained"
            color="error"
            onClick={() => setError(true)}
          >
            Throw Error
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
};

export default Auth;
