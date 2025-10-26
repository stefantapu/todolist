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
import { useState } from 'react';

interface AuthProps {
  onAuthSuccess: (user: { access_token: string; username: string }) => void;
}

const Auth = ({ onAuthSuccess }: AuthProps) => {
  const [loginFormName, setLoginFormName] = useState<'login' | 'register'>(
    'login'
  );
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLoginFormChange = (
    _: React.MouseEvent<HTMLElement>,
    newForm: 'login' | 'register'
  ) => {
    if (newForm) setLoginFormName(newForm);
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      const url =
        loginFormName === 'login'
          ? 'https://todos-be.vercel.app/auth/login'
          : 'https://todos-be.vercel.app/auth/register';

      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.message || `Error (${response.status})`);
      }
      if (!data.access_token) throw new Error('Server did not return a token.');

      jwtDecode(data.access_token); // просто проверяем, что токен валиден
      localStorage.setItem('accessToken', data.access_token);

      onAuthSuccess(data);
    } catch (error) {
      setErrorMessage((error as Error).message);
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

          <TextField
            label="Пароль"
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

          {errorMessage && (
            <Typography color="error" variant="body2" textAlign="center">
              {errorMessage}
            </Typography>
          )}

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
