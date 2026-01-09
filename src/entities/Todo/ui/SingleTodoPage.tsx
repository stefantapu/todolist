import { useParams, useNavigate } from 'react-router-dom';
import { Container, Box, Button, CircularProgress, Typography } from '@mui/material';
import { Todo } from './Todo';
import { useGetTodoByIdQuery } from '../api/todoApi';

export const SingleTodoPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

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
    <Container sx={{ py: 4 }}>
      <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
        <Button onClick={goBack} variant="contained" fullWidth>
          Back
        </Button>
      </Box>
      <Todo todo={todo} variant="fullpage" />
    </Container>
  );
};

export default SingleTodoPage;
