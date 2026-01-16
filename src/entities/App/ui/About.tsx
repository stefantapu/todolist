import {
  Box,
  Button,
  Card,
  Container,
  Typography,
  Paper,
  Stack,
  Avatar,
  Divider,
  useTheme,
  alpha,
} from '@mui/material';
import { useState } from 'react';
import {
  CheckCircleOutline,
  Code as CodeIcon,
  AutoAwesome,
  RocketLaunch,
  Security,
  Speed,
} from '@mui/icons-material';

type FeatureColor = 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';

interface Feature {
  icon: React.ReactNode;
  color: FeatureColor;
  title: string;
  description: string;
}

export const About = ({ 
  title = 'TaskMaster', 
  version = '1.0.0' 
}: { 
  title?: string; 
  version?: string 
}) => {
  const [count, setCounter] = useState(0);
  const theme = useTheme();

  const features: Feature[] = [
    {
      icon: <RocketLaunch />,
      color: 'primary',
      title: 'High Performance',
      description: 'Lightning fast task management with real-time updates and seamless state sync.',
    },
    {
      icon: <AutoAwesome />,
      color: 'secondary',
      title: 'Modern UI/UX',
      description: 'Beautifully crafted interface with smooth transitions and intuitive interactions.',
    },
    {
      icon: <Security />,
      color: 'success',
      title: 'Secure by Design',
      description: 'Enterprise-grade security ensuring your data remains private and protected.',
    },
    {
      icon: <Speed />,
      color: 'error',
      title: 'Optimized Workflow',
      description: 'Streamlined processes to help you focus on what matters most in your daily routine.',
    },
  ];

  return (
    <Box sx={{ minHeight: '100%', py: 4, backgroundColor: theme.palette.mode === 'dark' ? 'transparent' : '#f8f9fa' }}>
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, md: 8 },
            mb: 4,
            borderRadius: 4,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            color: 'white',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: -50,
              right: -50,
              width: 200,
              height: 200,
              borderRadius: '50%',
              background: alpha('#ffffff', 0.1),
            }}
          />
          <Stack spacing={2} alignItems="center" sx={{ position: 'relative', zIndex: 1 }}>
            <Typography variant="h2" component="h1" fontWeight="800" sx={{ fontSize: { xs: '2.5rem', md: '3.75rem' } }} gutterBottom>
              {title}
            </Typography>
            <Typography variant="h5" sx={{ opacity: 0.9, maxWidth: 600, mx: 'auto', fontWeight: 400 }}>
              The ultimate companion for your productivity journey. Organize, prioritize, and achieve more every day.
            </Typography>
            <Box
              sx={{
                mt: 2,
                px: 2,
                py: 0.5,
                borderRadius: 2,
                backgroundColor: alpha('#ffffff', 0.2),
                backdropFilter: 'blur(4px)',
                border: '1px solid',
                borderColor: alpha('#ffffff', 0.3),
              }}
            >
              <Typography variant="subtitle2" data-testid="version-container">
                Version {version}
              </Typography>
            </Box>
          </Stack>
        </Paper>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
          {/* Features */}
          <Box sx={{ flex: 2 }}>
            <Typography variant="h4" fontWeight="700" gutterBottom sx={{ mb: 3 }}>
              Powerful Features
            </Typography>
            <Box 
              sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, 
                gap: 3 
              }}
            >
              {features.map((feature, index) => (
                <Card
                  key={index}
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: theme.palette.divider,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: `0 12px 24px ${alpha(theme.palette.common.black, theme.palette.mode === 'dark' ? 0.4 : 0.08)}`,
                      borderColor: theme.palette.primary.main,
                    },
                  }}
                >
                  <Avatar
                    sx={{
                      mb: 2,
                      bgcolor: alpha(theme.palette[feature.color].main, 0.1),
                      color: theme.palette[feature.color].main,
                    }}
                  >
                    {feature.icon}
                  </Avatar>
                  <Typography variant="h6" fontWeight="600" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {feature.description}
                  </Typography>
                </Card>
              ))}
            </Box>
          </Box>

          {/* Interactive Section & Tech Stack */}
          <Box sx={{ flex: 1 }}>
            <Stack spacing={4}>
              <Card 
                elevation={0} 
                sx={{ 
                  p: 3, 
                  borderRadius: 3, 
                  border: '1px solid', 
                  borderColor: theme.palette.divider,
                  background: alpha(theme.palette.primary.main, 0.02)
                }}
              >
                <Typography variant="h6" fontWeight="700" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <CheckCircleOutline sx={{ mr: 1 }} color="primary" />
                  Try Interaction
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Experience the reactivity of our platform. Click the button to see the counter update.
                </Typography>
                <Stack direction="row" alignItems="center" spacing={3}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      CURRENT COUNT
                    </Typography>
                    <Typography variant="h3" fontWeight="800" color="primary" data-testid="counter">
                      {count}
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    data-testid="increment-button"
                    onClick={() => setCounter(c => c + 1)}
                    sx={{ 
                      borderRadius: 2, 
                      textTransform: 'none', 
                      fontWeight: '700',
                      px: 3,
                      py: 1,
                      boxShadow: `0 4px 14px 0 ${alpha(theme.palette.primary.main, 0.39)}`,
                      '&:hover': {
                        boxShadow: `0 6px 20px 0 ${alpha(theme.palette.primary.main, 0.23)}`,
                      }
                    }}
                  >
                    Increment
                  </Button>
                </Stack>
              </Card>

              <Card elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: theme.palette.divider }}>
                <Typography variant="h6" fontWeight="700" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <CodeIcon sx={{ mr: 1 }} color="primary" />
                  Tech Stack
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Stack direction="row" flexWrap="wrap" gap={1}>
                  {['React 19', 'TypeScript', 'Redux toolkit', 'MUI', 'Vite', 'Vitest'].map(tech => (
                    <Box
                      key={tech}
                      sx={{
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 1,
                        backgroundColor: alpha(theme.palette.primary.main, 0.08),
                        color: theme.palette.primary.main,
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        border: '1px solid',
                        borderColor: alpha(theme.palette.primary.main, 0.1),
                      }}
                    >
                      {tech}
                    </Box>
                  ))}
                </Stack>
              </Card>
            </Stack>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};



