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
import { useTodosStore } from '../../entities/Todo/model/store/useTodosStore';
import { useAppSelector } from '../../app/store';

interface Props {
  toggleTheme: () => void;
  mode: 'light' | 'dark';
}

const AppBar = ({ toggleTheme, mode }: Props) => {
  const todos = useTodosStore(state => state.todos);
  const undoneTodos = todos.filter(todo => !todo.completed);

  const user = useAppSelector(state => state.userSlice.user);

  const username = user?.username;

  function logOut() {
    localStorage.clear();
    window.location.reload();
    // window.location.href = '/login'; use when pagination available
  }

  return (
    <MuiAppBar position="sticky">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          My App
        </Typography>

        <div style={{ display: 'flex', gap: '10px' }}>
          {username && (
            <Button color="inherit">To Do's{' - ' + undoneTodos.length}</Button>
          )}

          <Button color="inherit">About</Button>

          <IconButton color="inherit" onClick={toggleTheme}>
            {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </IconButton>

          {username ? (
            <>
              <Tooltip title={username}>
                <Avatar src="" alt={username}>
                  {username[0]}
                </Avatar>
              </Tooltip>
              <Button color="inherit" onClick={logOut}>
                Logout
              </Button>
            </>
          ) : (
            <Button color="inherit">Login</Button>
          )}
        </div>
      </Toolbar>
    </MuiAppBar>
  );
};

export default AppBar;
