import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Avatar, Stack, Tooltip } from '@mui/material';

const ButtonAppBar = () => {
  return (
    <AppBar position="sticky">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Stack direction={'row'} spacing={2} style={{ flexGrow: 1 }}>
          <Typography variant="h6" component="div">
            Todos
          </Typography>
          <Typography variant="h6" component="div">
            About
          </Typography>
        </Stack>

        <Button color="inherit">Login</Button>
        <Tooltip title="User">
          <Avatar src=""></Avatar>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
};

export default ButtonAppBar;
