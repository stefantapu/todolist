import { Box, Button, Card, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const About = () => {
  const [count, setCounter] = useState(0);
  const navigate = useNavigate();
  return (
    <>
      <Box
        sx={{
          padding: 1,
        }}
      >
        <Card elevation={4} sx={{ padding: 1 }}>
          <h1>About Page</h1>
          <Typography data-testid={'version-container'}></Typography>
          <span data-testid={'counter'}>{count}</span>
          <Button
            variant="contained"
            data-testid={'increment-button'}
            onClick={() => setCounter(c => c + 1)}
          >
            +1
          </Button>
          <Button variant="contained" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </Card>
      </Box>
    </>
  );
};
