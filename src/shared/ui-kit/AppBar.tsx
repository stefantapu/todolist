import { Brightness7 } from '@mui/icons-material';
import Brightness4 from '@mui/icons-material/Brightness4';
import {
  AppBar as MuiAppBar,
  Toolbar,
  Typography,
  Button,
  Avatar,
  Tooltip,
  IconButton,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { selectUser, removeUser } from '../../entities/User/model/store/userStore';
import { selectUnDoneTodosLenght } from '../../entities/Todo/model/store/selectors/selectUnDoneTodos';
import { useLocation, useNavigate } from 'react-router-dom';

interface Props {
  toggleTheme: () => void;
  mode: 'light' | 'dark';
}

const AppBar = ({ toggleTheme, mode }: Props) => {
  const dispatch = useAppDispatch();

  const undoneTodos = useAppSelector(selectUnDoneTodosLenght);
  const user = useAppSelector(selectUser);
  const username = user?.username;

  const location = useLocation();
  const navigate = useNavigate();

  const isAboutPage = location.pathname === '/about';
  const isHomePage = location.pathname === '/';

  const handleRedirectToProfile = () => {
    navigate('/profile');
  };

  function logOut() {
    dispatch(removeUser());
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    navigate('/auth');
  }

  return (
    <MuiAppBar position="sticky">
      <Toolbar>
        <Typography onClick={() => navigate('/')} variant="h6" sx={{ flexGrow: 1 }}>
          Do!
        </Typography>

        <div style={{ display: 'flex', gap: '10px' }}>
          {username && <Button color="inherit">{undoneTodos}</Button>}

          {!isHomePage && (
            <Button color="inherit" onClick={() => navigate('/')}>
              Home
            </Button>
          )}

          {!isAboutPage && (
            <Button color="inherit" onClick={() => navigate('/about')}>
              About
            </Button>
          )}

          <IconButton color="inherit" onClick={toggleTheme}>
            {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </IconButton>

          {username ? (
            <>
              <Tooltip title={username}>
                <Avatar
                  src=""
                  alt={username}
                  onClick={handleRedirectToProfile}
                  sx={{ cursor: 'pointer' }}
                >
                  {username[0]}
                </Avatar>
              </Tooltip>
              <Button color="inherit" onClick={logOut}>
                Logout
              </Button>
            </>
          ) : (
            <Button color="inherit" onClick={() => navigate('/')}>
              Login
            </Button>
          )}
        </div>
      </Toolbar>
    </MuiAppBar>
  );
};

export default AppBar;
