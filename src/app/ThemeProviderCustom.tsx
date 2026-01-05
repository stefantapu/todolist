import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

// Тип для режима темы: светлая или тёмная
type ColorMode = 'light' | 'dark';

// Интерфейс для контекста темы: содержит текущий режим и функцию переключения
interface ThemeContextProps {
  mode: ColorMode;
  toggleTheme: () => void;
}

// Создаём контекст темы с дефолтными значениями
const ThemeContext = createContext<ThemeContextProps>({
  mode: 'light',
  toggleTheme: () => {},
});

// Хук для доступа к контексту темы
// eslint-disable-next-line react-refresh/only-export-components
export const useThemeMode = () => useContext(ThemeContext);

// Компонент ThemeProviderCustom обеспечивает приложение темой MUI и хранит состояние темы
export const ThemeProviderCustom = ({ children }: { children: React.ReactNode }) => {
  // Состояние для хранения текущего режима темы, берём из localStorage или по умолчанию 'light'
  const [mode, setMode] = useState<ColorMode>(
    (localStorage.getItem('theme') as ColorMode) || 'light'
  );

  // Сохраняем выбранный режим темы в localStorage при изменении
  useEffect(() => {
    localStorage.setItem('theme', mode);
  }, [mode]);

  // Создаём тему MUI на основе текущего режима
  const theme = useMemo(() => createTheme({ palette: { mode } }), [mode]);

  // Функция для переключения между светлой и тёмной темой
  const toggleTheme = () => setMode(prev => (prev === 'light' ? 'dark' : 'light'));

  // Оборачиваем приложение в ThemeProvider и передаём контекст темы
  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline /> {/* Сброс стандартных стилей браузера */}
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
