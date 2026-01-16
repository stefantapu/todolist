import { Brightness7, Login as LoginIcon, Logout as LogoutIcon, HistoryEdu as LogoIcon } from '@mui/icons-material';
import Brightness4 from '@mui/icons-material/Brightness4';
import {
  AppBar as MuiAppBar,
  Toolbar,
  Typography,
  Button,
  Avatar,
  Tooltip,
  IconButton,
  Box,
  Container,
  Stack,
  useTheme,
  alpha,
  Badge,
  Chip,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { selectUser, removeUser } from '../../entities/User/model/store/userStore';
import { selectUnDoneTodosLenght } from '../../entities/Todo/model/store/selectors/selectUnDoneTodos';
import { useLocation, useNavigate } from 'react-router-dom';
import { useGetAllTodosQuery } from '../../entities/Todo/api/todoApi';

interface Props {
  toggleTheme: () => void;
  mode: 'light' | 'dark';
}

const AppBar = ({ toggleTheme, mode }: Props) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const user = useAppSelector(selectUser);
  const username = user?.username;

  useGetAllTodosQuery(undefined, {
    skip: !user?.access_token,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const undoneTodos = useAppSelector(selectUnDoneTodosLenght);

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

  const navItemStyles = (isActive: boolean) => ({
    textTransform: 'none',
    fontWeight: 700,
    fontSize: '0.95rem',
    color: isActive ? theme.palette.primary.main : theme.palette.text.primary,
    position: 'relative',
    '&::after': isActive ? {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: '10%',
      width: '80%',
      height: '3px',
      backgroundColor: theme.palette.primary.main,
      borderRadius: '4px 4px 0 0',
    } : {},
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.08),
    },
  });

  return (
    <MuiAppBar 
        position="sticky" 
        elevation={0}
        sx={{ 
            backgroundColor: alpha(theme.palette.background.paper, 0.8),
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid',
            borderColor: theme.palette.divider,
            color: theme.palette.text.primary,
            top: 0,
            zIndex: theme.zIndex.appBar,
        }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: { xs: 64, md: 72 } }}>
          {/* Logo Section */}
          <Stack 
            direction="row" 
            alignItems="center" 
            spacing={1} 
            onClick={() => navigate('/')}
            sx={{ cursor: 'pointer', flexGrow: { xs: 1, md: 0 }, mr: 4 }}
          >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    color: 'white',
                }}
            >
                <img src="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>✦</text></svg>" alt="" />
            </Box>
            <Typography 
                variant="h6" 
                fontWeight={800} 
                sx={{ 
                    letterSpacing: '-0.5px',
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                }}
            >
                TaskMaster
            </Typography>
          </Stack>

          {/* Desktop Navigation */}
          <Stack 
            direction="row" 
            spacing={1} 
            sx={{ display: { xs: 'none', md: 'flex' }, flexGrow: 1 }}
          >
            <Button sx={navItemStyles(isHomePage)} onClick={() => navigate('/')}>
              Tasks
            </Button>
            <Button sx={navItemStyles(isAboutPage)} onClick={() => navigate('/about')}>
              About
            </Button>
          </Stack>

          {/* Action Icons Section */}
          <Stack direction="row" alignItems="center" spacing={{ xs: 1, md: 2 }}>
            {username && (
               <Tooltip title="Remaining tasks">
                   <Badge 
                        badgeContent={undoneTodos} 
                        color="error"
                        sx={{ 
                            '& .MuiBadge-badge': { 
                                fontSize: '0.7rem', 
                                height: 18, 
                                minWidth: 18 
                            } 
                        }}
                    >
                        <Chip 
                            label="Active" 
                            size="small" 
                            variant="outlined"
                            sx={{ 
                                fontWeight: 700, 
                                borderColor: alpha(theme.palette.primary.main, 0.3),
                                display: { xs: 'none', sm: 'flex' }
                            }}
                        />
                    </Badge>
               </Tooltip>
            )}

            <IconButton onClick={toggleTheme} color="inherit" sx={{ ml: 1 }}>
                {mode === 'dark' ? (
                    <Brightness7 fontSize="small" sx={{ color: theme.palette.warning.light }} />
                ) : (
                    <Brightness4 fontSize="small" sx={{ color: theme.palette.primary.main }} />
                )}
            </IconButton>

            {username ? (
              <>
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ ml: 1 }}>
                    <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
                        <Typography variant="caption" display="block" color="text.secondary" fontWeight={600} sx={{ lineHeight: 1 }}>
                            WELCOME
                        </Typography>
                        <Typography variant="body2" fontWeight={700}>
                            {username}
                        </Typography>
                    </Box>
                    <Tooltip title="Profile">
                        <Avatar
                        src=""
                        alt={username}
                        onClick={handleRedirectToProfile}
                        sx={{ 
                            cursor: 'pointer',
                            width: 36,
                            height: 36,
                            bgcolor: theme.palette.primary.main,
                            fontSize: '1rem',
                            fontWeight: 700,
                            transition: 'all 0.2s',
                            '&:hover': {
                                transform: 'scale(1.1)',
                                boxShadow: `0 0 0 2px ${theme.palette.background.paper}, 0 0 0 4px ${theme.palette.primary.main}`,
                            }
                        }}
                        >
                        {username[0].toUpperCase()}
                        </Avatar>
                    </Tooltip>
                    <IconButton 
                        onClick={logOut} 
                        size="small" 
                        color="error" 
                        sx={{ 
                            bgcolor: alpha(theme.palette.error.main, 0.05),
                            '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.1) } 
                        }}
                    >
                        <LogoutIcon fontSize="small" />
                    </IconButton>
                </Stack>
              </>
            ) : (
              <Button 
                variant="contained" 
                startIcon={<LoginIcon />}
                onClick={() => navigate('/')}
                sx={{ 
                    borderRadius: 2, 
                    textTransform: 'none', 
                    fontWeight: 700,
                    px: 3,
                }}
              >
                Login
              </Button>
            )}
          </Stack>
        </Toolbar>
      </Container>
    </MuiAppBar>
  );
};

export default AppBar;
