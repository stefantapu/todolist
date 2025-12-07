import { Outlet } from 'react-router-dom';
import { useThemeMode } from '../../../app/ThemeProviderCustom';
import AppBar from '../../../shared/ui-kit/AppBar';
import ErrorHandler from './ErrorHandler';

const Layout = () => {
  const { mode, toggleTheme } = useThemeMode();
  return (
    <>
      <AppBar toggleTheme={toggleTheme} mode={mode} />
      <ErrorHandler>
        <Outlet />
      </ErrorHandler>
    </>
  );
};

export default Layout;
