import Box from '@mui/material/Box';
import { Button, CircularProgress, Grid, Input, Paper, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { selectFilters } from '../model/store/todosStore';
import { useAppSelector } from '../../../app/store';
import { Todo } from './Todo';
import { useAddTodoMutation, useGetTodosQuery } from '../api/todoApi';
import { useSnackbar } from 'notistack';
import { selectUser } from '../../User/model/store/userStore';

const Todos = () => {
  const { enqueueSnackbar } = useSnackbar();
  const user = useAppSelector(selectUser);
  const filters = useAppSelector(selectFilters);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoDescription, setNewTodoDescription] = useState('');

  const {
    data,
    isFetching: isGettingTodos,
    isLoading: isGettingTodosInitial, // важно: именно initial load
    isError: isGettingError,
    refetch,
  } = useGetTodosQuery(filters, { skip: !user?.access_token, pollingInterval: 15000 });

  const [
    addTodoToBackend,
    { isLoading: isAddingTodo, isError: isAddingError, isSuccess: isAddedSucces },
  ] = useAddTodoMutation();

  const isInitialLoading = isGettingTodosInitial && !data;
  const isError = isAddingError || isGettingError;

  useEffect(() => {
    const handleClearFields = () => {
      setNewTodoTitle('');
      setNewTodoDescription('');
    };
    if (isAddedSucces) {
      handleClearFields();
    }
  }, [isAddedSucces]);

  useEffect(() => {
    if (isError) {
      enqueueSnackbar('Error fetching todos', { variant: 'error' });
    }
  }, [enqueueSnackbar, isError]);

  if (isInitialLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Paper elevation={24} sx={{ padding: 4, margin: 2, marginTop: 4 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Button variant="contained" onClick={refetch} disabled={isGettingTodos}>
            🔄 Refresh
          </Button>

          {/* индикатор фонового обновления (polling/refetch) */}
          {isGettingTodos ? <CircularProgress size={20} /> : null}
        </Stack>

        <Stack
          direction="column"
          spacing={2}
          sx={{
            width: '100%',
            alignItems: 'center',
            marginTop: 2,
          }}
        >
          <Input
            sx={{
              width: '100%',
              fontWeight: 500,
              fontSize: 26,
              lineHeight: 1.6,
            }}
            multiline
            placeholder="Title"
            value={newTodoTitle}
            onChange={e => setNewTodoTitle(e.target.value)}
          />
          <Input
            sx={{ width: '100%' }}
            multiline
            placeholder="Description"
            value={newTodoDescription}
            onChange={e => setNewTodoDescription(e.target.value)}
          />
          <Button
            variant="outlined"
            disabled={!newTodoTitle || isAddingTodo}
            onClick={() => {
              if (!user?.access_token) {
                enqueueSnackbar('Please sign in to add tasks', { variant: 'warning' });
                return;
              }
              addTodoToBackend({ title: newTodoTitle, description: newTodoDescription });
            }}
            sx={{ width: '50%' }}
          >
            Add task
          </Button>
        </Stack>
      </Paper>

      <Grid
        container
        direction="row"
        gap={2}
        sx={{
          p: 2,
          justifyContent: 'flex-start',
          alignItems: 'stretch',
          height: '100%',
        }}
      >
        {data?.map(todo => (
          <Todo todo={todo} key={todo._id} />
        ))}
      </Grid>
    </Box>
  );
};

export default Todos;
