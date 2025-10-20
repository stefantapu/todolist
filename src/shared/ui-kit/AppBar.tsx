import {
  AppBar as MuiAppBar,
  Toolbar,
  Typography,
  Button,
  Avatar,
  Tooltip,
} from '@mui/material';

const AppBar = () => {
  return (
    <MuiAppBar position="fixed">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          My App
        </Typography>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button color="inherit">To Do's</Button>
          <Button color="inherit">About</Button>
          <Tooltip title="Пользователь">
            <Avatar />
          </Tooltip>
        </div>
      </Toolbar>
    </MuiAppBar>
  );
};

export default AppBar;
