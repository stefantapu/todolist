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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Zod Validation
const emailSchema = z.string().email({ message: 'Invalid email address!' });
const passwordSchema = z
  .string()
  .min(8, { message: 'Invalid password, min 8 chars' })
  .max(50, { message: 'Password must be less than 50 characters' });
const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});
type Inputs = z.infer<typeof loginSchema>;

const Auth = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [loginFormName, setLoginFormName] = useState<'login' | 'register'>('login');
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectIsLoading);
  const navigate = useNavigate();

  // react-hook-form + zod
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Inputs>({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
  });

  const onSubmit = async (data: Inputs) => {
    try {
      dispatch(setIsLoading(true));
      const url = loginFormName === 'login' ? 'auth/login' : 'auth/register';
      const loginData = await rootApi.post<UserType>(url, {
        username: data.email,
        password: data.password,
      });

      if (loginFormName === 'login') {
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
        enqueueSnackbar('Registration successful! Please log in.', {
          variant: 'success',
        });
        reset();
      }
    } catch (error) {
      if (error instanceof ZodError) {
        error.issues.forEach(issue => {
          enqueueSnackbar(`${issue.message}`, {
            variant: 'error',
          });
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
          {/* Email */}
          <TextField
            label="E-mail"
            type="email"
            fullWidth
            disabled={isLoading}
            error={!!errors.email}
            helperText={errors.email?.message}
            {...register('email')}
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
          {/* Password */}
          <TextField
            label="Password"
            type="password"
            fullWidth
            disabled={isLoading}
            error={!!errors.password}
            helperText={errors.password?.message}
            {...register('password')}
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
          <Button
            onClick={handleSubmit(onSubmit)}
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
