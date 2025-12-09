import { Box, Button, Card } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const About = () => {
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
          <span>Version 0.0.2</span>
          <Button variant="contained" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </Card>
      </Box>
    </>
  );
};
