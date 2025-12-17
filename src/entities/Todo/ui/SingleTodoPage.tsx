import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Box, Button, CircularProgress, Typography } from '@mui/material';
import { Todo } from './Todo';
import type { TodoType } from '../model/todoType';
import { getTodos, getTodoById } from '../api/todoApi';
import { useAppSelector } from '../../../app/store';
import { selectFilters } from '../model/store/todosStore';

export const SingleTodoPage = () => {
  const { id } = useParams<{ id: string }>();
  const filters = useAppSelector(selectFilters);
  const navigate = useNavigate();
  const [todo, setTodo] = useState<TodoType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTodo = async () => {
      setLoading(true);
      try {
        if (id) {
          // fetch single todo by id from the URL
          const response = await getTodoById(id);
          const item: TodoType | null = response?.data ?? null;
          setTodo(item);
        } else {
          const response = await getTodos(filters);
          const items: TodoType[] = response.data || [];
          const found = items.find(t => t._id === id) || null;
          setTodo(found);
        }
      } catch (err) {
        console.error('Failed to load todos', err);
        setTodo(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTodo();
  }, [filters, id]);

  const goBack = () => navigate(-1);

  if (loading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

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
      <Box sx={{ mb: 2 }}>
        <Button onClick={goBack} variant="contained" fullWidth>
          Back
        </Button>
      </Box>

      <Todo
        todo={todo}
        variant="fullpage"
        setTodo={(t: TodoType) => {
          // allow the child to update local page state (optimistic updates)
          setTodo(prev => (prev && t._id === prev._id ? { ...prev, ...t } : prev));
        }}
      />
    </Container>
  );
};

export default SingleTodoPage;
