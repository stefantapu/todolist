import { jwtDecode } from 'jwt-decode';
import { useAppDispatch, useAppSelector } from '../../../app/store';
import { removeUser, selectUser } from '../model/store/userStore';
import {
  Avatar,
  Box,
  Button,
  Card,
  Container,
  Divider,
  Paper,
  Stack,
  Typography,
  useTheme,
  alpha,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Badge as BadgeIcon,
  Email as EmailIcon,
  Event as EventIcon,
  Security as SecurityIcon,
  Logout as LogoutIcon,
  ArrowBack as ArrowBackIcon,
  VpnKey as KeyIcon,
  AccountCircle as AccountIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  if (!user) {
    return null;
  }

  const tokenUntilSec = jwtDecode(user.access_token).exp!;
  const tokenUntil = new Date(tokenUntilSec * 1000).toLocaleDateString();
  const tokenUntilFull = new Date(tokenUntilSec * 1000).toLocaleString();

  function logOut() {
    dispatch(removeUser());
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    navigate('/auth');
  }

  return (
    <Box sx={{ minHeight: '100%', py: 6, backgroundColor: theme.palette.mode === 'dark' ? 'transparent' : '#f8f9fa' }}>
      <Container maxWidth="md">
        {/* Back Button */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{ mb: 4, textTransform: 'none', fontWeight: 600, color: 'text.secondary' }}
        >
          Back to Dashboard
        </Button>

        {/* Profile Hero Card */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, md: 6 },
            mb: 4,
            borderRadius: 4,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Decorative Background Elements */}
          <Box
            sx={{
              position: 'absolute',
              top: -50,
              right: -50,
              width: 250,
              height: 250,
              borderRadius: '50%',
              background: alpha('#ffffff', 0.1),
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: -20,
              left: 10,
              width: 100,
              height: 100,
              borderRadius: '50%',
              background: alpha('#ffffff', 0.05),
            }}
          />

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={4}
            alignItems="center"
            sx={{ position: 'relative', zIndex: 1 }}
          >
            <Avatar
              sx={{
                width: { xs: 100, md: 140 },
                height: { xs: 100, md: 140 },
                fontSize: { xs: '3rem', md: '4rem' },
                bgcolor: 'white',
                color: theme.palette.primary.main,
                fontWeight: 800,
                boxShadow: `0 8px 32px 0 ${alpha(theme.palette.common.black, 0.2)}`,
                border: '4px solid',
                borderColor: alpha('#ffffff', 0.3),
              }}
            >
              {user.username.slice(0, 1).toUpperCase()}
            </Avatar>
            <Box sx={{ textAlign: { xs: 'center', sm: 'left' }, flexGrow: 1 }}>
              <Typography variant="h3" fontWeight={800} sx={{ letterSpacing: '-1px' }}>
                {user.username}
              </Typography>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                justifyContent={{ xs: 'center', sm: 'flex-start' }}
                sx={{ mt: 1, opacity: 0.9 }}
              >
                <BadgeIcon fontSize="small" />
                <Typography variant="subtitle1" fontWeight={500}>
                  Verified TaskMaster Account
                </Typography>
              </Stack>
              <Box sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<LogoutIcon />}
                  onClick={logOut}
                  sx={{
                    bgcolor: alpha('#ffffff', 0.2),
                    backdropFilter: 'blur(10px)',
                    border: '1px solid',
                    borderColor: alpha('#ffffff', 0.3),
                    textTransform: 'none',
                    fontWeight: 700,
                    px: 3,
                    '&:hover': {
                      bgcolor: alpha('#ffffff', 0.3),
                    },
                  }}
                >
                  Logout
                </Button>
              </Box>
            </Box>
          </Stack>
        </Paper>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
          {/* Account Details */}
          <Card
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 4,
              border: '1px solid',
              borderColor: theme.palette.divider,
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
            }}
          >
            <Typography variant="h6" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AccountIcon color="primary" />
              Account Details
            </Typography>
            <Divider />
            
            <Stack spacing={2.5}>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                  User Name
                </Typography>
                <Typography variant="body1" fontWeight={600} sx={{ mt: 0.5 }}>
                  {user.username}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                  Associated Email
                </Typography>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.5 }}>
                  <EmailIcon fontSize="small" sx={{ color: 'text.secondary', opacity: 0.5 }} />
                  <Typography variant="body1" fontWeight={600}>
                    {user.username.toLowerCase()}
                  </Typography>
                </Stack>
              </Box>
            </Stack>
          </Card>

          {/* Security & Token */}
          <Card
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 4,
              border: '1px solid',
              borderColor: theme.palette.divider,
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
            }}
          >
            <Typography variant="h6" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SecurityIcon color="primary" />
              Security Session
            </Typography>
            <Divider />

            <Stack spacing={2.5}>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                  Access Token Expires
                </Typography>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.5 }}>
                  <EventIcon fontSize="small" sx={{ color: 'text.secondary', opacity: 0.5 }} />
                  <Typography variant="body1" fontWeight={600}>
                    {tokenUntil}
                  </Typography>
                </Stack>
                <Typography variant="caption" color="text.secondary">
                  Expires at: {tokenUntilFull}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                  Session Status
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'success.main', boxShadow: `0 0 10px ${theme.palette.success.main}` }} />
                    <Typography variant="body2" fontWeight={700} color="success.main">
                        Active Secured Session
                    </Typography>
                </Box>
              </Box>
            </Stack>
          </Card>
        </Box>
      </Container>
    </Box>
  );
};

export default Profile;
