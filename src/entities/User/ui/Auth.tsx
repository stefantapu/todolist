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

interface AuthProps {
  onAuthSuccess: (user: { access_token: string; username: string }) => void;
}

// Компонент Auth отвечает за отображение формы авторизации и регистрации.
// Принимает проп onAuthSuccess — функцию, вызываемую при успешной авторизации пользователя.
const Auth = ({ onAuthSuccess }: AuthProps) => {
  const { enqueueSnackbar } = useSnackbar();
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

      // Выбираем URL для запроса в зависимости от типа формы
      const url = loginFormName === 'login' ? 'auth/login' : 'auth/register';

      const loginData = await rootApi.post<UserType>(url, {
        username: username,
        password: password,
      });
      const accessToken = loginData.data.access_token;

      // Сохраняем токен в localStorage
      localStorage.setItem('access_token', accessToken);

      // Вызываем функцию onAuthSuccess, передавая данные пользователя
      onAuthSuccess(loginData.data);
      enqueueSnackbar('Wellcome!', { variant: 'success' });
    } catch (error) {
      // В случае ошибки — сохраняем текст ошибки для отображения
      const axiosError = error as AxiosError<{ message: string }>;
      enqueueSnackbar(axiosError.response?.data.message, { variant: 'error' });
      // enqueueSnackbar(errorMessage, { variant: 'error' });
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
