import { Box, Button, Card, Typography } from '@mui/material';
import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

export const About = ({ title, version }: { title?: string; version?: string }) => {
  const [count, setCounter] = useState(0);
  return (
    <>
      <Box
        sx={{
          padding: 1,
        }}
      >
        <Card elevation={4} sx={{ padding: 1, backgroundColor: '#ef5350' }}>
          <h1>{title}</h1>
          <Typography data-testid={'version-container'}>{version}</Typography>
          <span data-testid={'counter'}>{count}</span>
          <Button
            variant="contained"
            data-testid={'increment-button'}
            onClick={() => {
              setCounter(c => c + 1);
            }}
          >
            +1
          </Button>
        </Card>
      </Box>
    </>
  );
};
