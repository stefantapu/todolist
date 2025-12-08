import { Box, Card } from '@mui/material';

export const About = () => {
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
        </Card>
      </Box>
    </>
  );
};
