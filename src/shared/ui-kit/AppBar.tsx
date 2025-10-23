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

interface Props {
  toggleTheme: () => void;
  mode: 'light' | 'dark';
  access_token?: string;
  username?: string;
}

const AppBar = ({ toggleTheme, mode, access_token, username }: Props) => {
  //   const { username } = props;
  return (
    <MuiAppBar position="fixed">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          My App
        </Typography>

        <div style={{ display: 'flex', gap: '10px' }}>
          {username && <Button color="inherit">To Do's</Button>}

          <Button color="inherit">About</Button>

          <IconButton color="inherit" onClick={toggleTheme}>
            {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </IconButton>

          {username ? (
            <Tooltip title={username}>
              <Avatar src="" alt={username}>
                {username[0]}
              </Avatar>
            </Tooltip>
          ) : (
            <Button color="inherit">Login</Button>
          )}
        </div>
      </Toolbar>
    </MuiAppBar>
  );
};

export default AppBar;
