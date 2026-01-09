import {
  Box,
  Button,
  CircularProgress,
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
import { selectIsLoading, setIsLoading, setUser } from '../model/store/userStore';
import { useAppDispatch, useAppSelector } from '../../../app/store';
import { useNavigate } from 'react-router-dom';
import { z, ZodError } from 'zod';

const Auth = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [loginFormName, setLoginFormName] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectIsLoading);
  const navigate = useNavigate();

  const emailSchema = z.email({ message: 'Invalid email address!' });
  const passwordSchema = z.string().min(8, { message: 'Invalid password, min 8 chars' });

  const handleSubmit = async () => {
    try {
      emailSchema.parse(username);
      passwordSchema.parse(password);

      dispatch(setIsLoading(true));
      const url = loginFormName === 'login' ? 'auth/login' : 'auth/register';
      const loginData = await rootApi.post<UserType>(url, {
        username,
        password,
      });

      if (loginFormName === 'login') {
        // Persist user in redux
        dispatch(setUser(loginData.data));
        try {
          localStorage.setItem('access_token', loginData.data.access_token);
          localStorage.setItem('user', JSON.stringify(loginData.data));
        } catch (e) {
          console.error('Failed to persist user to localStorage', e);
        }
        enqueueSnackbar('Welcome!', { variant: 'success' });

        const params = new URLSearchParams(window.location.search);
        const back = params.get('back');
        navigate(back || '/');
      } else {
        // Регистрация успешна, но не логиним
        enqueueSnackbar('Registration successful! Please log in.', {
          variant: 'success',
        });
      }
    } catch (error) {
      if (error instanceof ZodError) {
        enqueueSnackbar(`${error.issues[0].message}`, {
          variant: 'error',
        });
        return;
      }
      enqueueSnackbar(`${error}`, { variant: 'error' });
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
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
              backgroundColor: loginFormName === 'login' ? '#1976d2' : '#3ecd3eff',
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
