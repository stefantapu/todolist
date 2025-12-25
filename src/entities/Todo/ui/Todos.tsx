import Box from '@mui/material/Box';
import { Button, CircularProgress, Grid, Input, Paper, Stack } from '@mui/material';
import React, { useEffect, useState } from 'react';
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

  //RTK
  const {
    data,
    isFetching: isGettingTodos,
    isError: isGettingError,
  } = useGetTodosQuery(filters, { skip: !user?.access_token });

  const [
    addTodoToBackend,
    { isLoading: isAddingTodo, isError: isAddingError, isSuccess: isAddedSucces },
  ] = useAddTodoMutation();

  const isLoading = isAddingTodo || isGettingTodos;
  const isError = isAddingError || isGettingError;

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoTitle(e.target.value);
  };
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoDescription(e.target.value);
  };

  const handldeAddTodo = () => {
    if (!user?.access_token) {
      enqueueSnackbar('Please sign in to add tasks', { variant: 'warning' });
      return;
    }
    addTodoToBackend({ title: newTodoTitle, description: newTodoDescription });
  };

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

  if (isLoading) {
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
        <Stack
          direction="column"
          spacing={2}
          sx={{
            width: '100%',
            alignItems: 'center',
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
            onChange={handleTitleChange}
          />
          <Input
            sx={{
              width: '100%',
            }}
            multiline
            placeholder="Description"
            value={newTodoDescription}
            onChange={handleDescriptionChange}
          />
          <Button
            variant="outlined"
            disabled={!newTodoTitle}
            onClick={handldeAddTodo}
            sx={{
              width: '50%',
            }}
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
        {/* Рендерим каждую задачу через компонент Todo */}
        {data?.map(todo => {
          return <Todo todo={todo} key={todo._id} />;
        })}
      </Grid>
    </Box>
  );
};
export default Todos;
