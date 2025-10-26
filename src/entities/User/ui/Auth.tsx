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

// Компонент Auth отвечает за отображение формы авторизации и регистрации.
// Принимает проп onAuthSuccess — функцию, вызываемую при успешной авторизации пользователя.
const Auth = ({ onAuthSuccess }: AuthProps) => {
  // loginFormName — состояние, определяющее, какая форма отображается: "login" или "register"
  const [loginFormName, setLoginFormName] = useState<'login' | 'register'>(
    'login'
  );
  // username — состояние для хранения введённого email/имени пользователя
  const [username, setUsername] = useState('');
  // password — состояние для хранения введённого пароля
  const [password, setPassword] = useState('');
  // isLoading — состояние, показывающее, выполняется ли сейчас запрос к серверу
  const [isLoading, setIsLoading] = useState(false);
  // errorMessage — состояние для хранения текста ошибки, если она возникла
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // handleLoginFormChange — обработчик переключения между формой входа и регистрации
  const handleLoginFormChange = (
    _: React.MouseEvent<HTMLElement>,
    newForm: 'login' | 'register'
  ) => {
    if (newForm) setLoginFormName(newForm);
  };

  // handleSubmit — обработчик отправки формы (авторизация или регистрация)
  const handleSubmit = async () => {
    try {
      setIsLoading(true); // Включаем индикатор загрузки
      setErrorMessage(null); // Сбрасываем ошибку

      // Выбираем URL для запроса в зависимости от типа формы
      const url =
        loginFormName === 'login'
          ? 'https://todos-be.vercel.app/auth/login'
          : 'https://todos-be.vercel.app/auth/register';

      // Отправляем POST-запрос с данными пользователя
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
      });

      // Получаем ответ от сервера
      const data = await response.json().catch(() => ({}));

      // Если сервер вернул ошибку — выбрасываем исключение
      if (!response.ok) {
        throw new Error(data?.message || `Error (${response.status})`);
      }
      // Если нет access_token — выбрасываем исключение
      if (!data.access_token) throw new Error('Server did not return a token.');

      // Проверяем валидность токена
      jwtDecode(data.access_token);

      // Сохраняем токен в localStorage
      localStorage.setItem('accessToken', data.access_token);

      // Вызываем функцию onAuthSuccess, передавая данные пользователя
      onAuthSuccess(data);
    } catch (error) {
      // В случае ошибки — сохраняем текст ошибки для отображения
      setErrorMessage((error as Error).message);
    } finally {
      // Отключаем индикатор загрузки
      setIsLoading(false);
    }
  };

  // Возвращаем JSX — разметку формы авторизации/регистрации
  return (
    <Container
      maxWidth="sm"
      sx={{
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        minHeight: '100vh', // Центрируем форму по вертикали
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

          {/* Отображение ошибки, если она есть */}
          {errorMessage && (
            <Typography color="error" variant="body2" textAlign="center">
              {errorMessage}
            </Typography>
          )}

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
