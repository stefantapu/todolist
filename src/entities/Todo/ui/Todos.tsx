import Box from '@mui/material/Box';
import { Button, CircularProgress, Grid, Input, Paper, Stack } from '@mui/material';
import React, { useEffect, useState } from 'react';
import type { CreateTodoType } from '../model/todoType';
import { selectFilters, setIsLoading } from '../model/store/todosStore';
import { useAppDispatch, useAppSelector } from '../../../app/store';
import { Todo } from './Todo';
import { createTodo, useAddTodoMutation, useGetTodosQuery } from '../api/todoApi';
import { mockTodos } from '../model/mockTodos';
import { useSnackbar } from 'notistack';
import { selectUser } from '../../User/model/store/userStore';

const Todos = () => {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useAppDispatch();

  // const todos = useAppSelector(selectTodos);
  const user = useAppSelector(selectUser);
  const filters = useAppSelector(selectFilters);
  // const isLoading = useAppSelector(selectIsLoading);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoDescription, setNewTodoDescription] = useState('');

  //RTK
  const {
    data,
    isLoading: isGettingTodos,
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
    addTodoToBackend({ title: newTodoTitle, description: newTodoDescription });
  };

  const handleCreateTestTasks = async () => {
    dispatch(setIsLoading(true));
    try {
      if (!user?.access_token) return;

      const createPromises = mockTodos.map(m => {
        const payload: CreateTodoType = {
          title: m.title,
          description: m.description?.trim() ? m.description : ' ',
        };
        return createTodo(payload);
      });
      const results = await Promise.allSettled(createPromises);
      const succeeded = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;
      if (succeeded)
        enqueueSnackbar(`Created ${succeeded} test tasks`, { variant: 'success' });
      if (failed)
        enqueueSnackbar(`${failed} tasks failed to create`, { variant: 'warning' });
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Error creating test tasks', { variant: 'error' });
    } finally {
      dispatch(setIsLoading(false));
    }
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
          <Button
            variant="outlined"
            disabled={!user?.access_token || isLoading}
            onClick={handleCreateTestTasks}
            sx={{
              width: '50%',
            }}
          >
            Create test tasks
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
