import Box from '@mui/material/Box';
import {
  Button,
  CircularProgress,
  Grid,
  Input,
  Paper,
  Stack,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import type { TodoType } from '../model/todoType';
import {
  selectTodos,
  addTodo,
  updateTodo,
  setTodos,
} from '../model/store/todosStore';
import { useAppDispatch, useAppSelector } from '../../../app/store';
import { Todo } from './Todo';
import { getTodos } from '../api/todoApi';
import { useSnackbar } from 'notistack';
import { selectUser } from '../../User/model/store/userStore';

const Todos = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useAppDispatch();
  const todos = useAppSelector(selectTodos);
  const user = useAppSelector(selectUser);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoDescription, setNewTodoDescription] = useState('');

  // Update a single todo in Redux
  const setTodo = (todo: TodoType) => {
    dispatch(updateTodo(todo));
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoTitle(e.target.value);
  };
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoDescription(e.target.value);
  };

  const handldeAddTodo = () => {
    const newTodo: TodoType = {
      _id: Date.now().toString(),
      title: newTodoTitle,
      description: newTodoDescription,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      order: (todos?.length ?? 0) + 1,
    };
    dispatch(addTodo(newTodo));
    setNewTodoTitle('');
    setNewTodoDescription('');
  };

  useEffect(() => {
    if (!user?.access_token) return;

    getTodos(user?.access_token)
      .then(response => {
        dispatch(setTodos(response.data || []));
      })
      .catch(() => {
        enqueueSnackbar('Error fetching todos', { variant: 'error' });
        dispatch(setTodos([]));
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [dispatch, enqueueSnackbar, user?.access_token]);

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
        {todos.map(todo => {
          return <Todo todo={todo} key={todo._id} setTodo={setTodo} />;
        })}
      </Grid>
    </Box>
  );
};
export default Todos;
