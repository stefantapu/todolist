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
import {
  selectUser,
  removeUser,
} from '../../entities/User/model/store/userStore';
import { selectUnDoneTodosLenght } from '../../entities/Todo/model/store/selectors/selectUnDoneTodos';

interface Props {
  toggleTheme: () => void;
  mode: 'light' | 'dark';
}

const AppBar = ({ toggleTheme, mode }: Props) => {
  const dispatch = useAppDispatch();

  // const undoneTodos = todos.filter(todo => !todo.completed);
  const undoneTodos = useAppSelector(selectUnDoneTodosLenght);
  const user = useAppSelector(selectUser);
  const username = user?.username;

  function logOut() {
    dispatch(removeUser());
    localStorage.clear();
  }

  return (
    <MuiAppBar position="sticky">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          My App
        </Typography>

        <div style={{ display: 'flex', gap: '10px' }}>
          {username && (
            <Button color="inherit">To Do's{' - ' + undoneTodos}</Button>
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
