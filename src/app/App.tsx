import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import './App.css';
import AppBar from '../shared/ui-kit/AppBar.tsx';
import {
  Button,
  Container,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { PasswordRounded } from '@mui/icons-material';
import { useState } from 'react';

const App = () => {
  return (
    <>
      <AppBar />
      <Container
        maxWidth="sm"
        sx={{
          justifyContent: 'center',
          alignItems: 'center',
          width: '70%',
        }}
      >
        <Stack
          direction="column"
          spacing={2}
          sx={{
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
          }}
        >
          <Typography variant="h5" gutterBottom>
            Login
          </Typography>
          <Container maxWidth={'sm'}>
            <TextField
              label="E-mail"
              fullWidth
              size="small"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircle />
                    </InputAdornment>
                  ),
                },
              }}
              variant="outlined"
            />
          </Container>
          <Container maxWidth={'sm'}>
            <TextField
              label="Password"
              type="password"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PasswordRounded />
                    </InputAdornment>
                  ),
                },
              }}
              variant="outlined"
              size="small"
              fullWidth
            />
          </Container>
          <Button variant="contained">Enter</Button>
        </Stack>
      </Container>
    </>
  );
};

export default App;
