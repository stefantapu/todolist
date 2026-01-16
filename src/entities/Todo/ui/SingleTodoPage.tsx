import { useParams, useNavigate } from 'react-router-dom';
import { Container, Box, Button, CircularProgress, Typography, useTheme } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Todo } from './Todo';
import { useGetTodoByIdQuery } from '../api/todoApi';

export const SingleTodoPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = useTheme();

  const goBack = () => navigate(-1);

  const {
    data: todo,
    isLoading,
    isFetching,
    isError,
    error,
  } = useGetTodoByIdQuery(id ?? null, {
    skip: !id,
  });

  if (!id) {
    return (
      <Container>
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">No todo id provided</Typography>
          <Button onClick={goBack} sx={{ mt: 2 }} variant="contained">
            Back
          </Button>
        </Box>
      </Container>
    );
  }

  if (isLoading || isFetching) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container>
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Failed to load todo</Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            {JSON.stringify(error)}
          </Typography>
          <Button onClick={goBack} sx={{ mt: 2 }} variant="contained">
            Back
          </Button>
        </Box>
      </Container>
    );
  }

  if (!todo) {
    return (
      <Container>
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Todo not found</Typography>
          <Button onClick={goBack} sx={{ mt: 2 }} variant="contained">
            Back
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', py: 4, backgroundColor: theme.palette.mode === 'dark' ? 'transparent' : '#f8f9fa' }}>
      <Container maxWidth="md">
        <Button 
          onClick={goBack} 
          variant="text" 
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 2, color: 'text.secondary' }}
        >
          Back to list
        </Button>
        <Todo todo={todo} variant="fullpage" />
      </Container>
    </Box>
  );
};

export default SingleTodoPage;
