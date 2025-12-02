import { Outlet } from 'react-router-dom';
import { useThemeMode } from '../../../app/ThemeProviderCustom';
import AppBar from '../../../shared/ui-kit/AppBar';

const Layout = () => {
  const { mode, toggleTheme } = useThemeMode();
  return (
    <>
      <AppBar toggleTheme={toggleTheme} mode={mode} />
      <Outlet></Outlet>
    </>
  );
};

export default Layout;
