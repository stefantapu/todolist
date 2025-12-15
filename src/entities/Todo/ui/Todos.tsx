import Box from '@mui/material/Box';
import { Button, CircularProgress, Grid, Input, Paper, Stack } from '@mui/material';
import React, { useCallback, useEffect, useState, useMemo } from 'react';
import type { CreateTodoType, TodoType } from '../model/todoType';
import { selectTodos, updateTodo, setTodos } from '../model/store/todosStore';
import { useAppDispatch, useAppSelector } from '../../../app/store';
import { Todo } from './Todo';
import { createTodo, getTodos } from '../api/todoApi';
import { mockTodos } from '../model/mockTodos';
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
  const [searchQuery, setSearchQuery] = useState('');

  const setTodo = useCallback(
    (todo: TodoType) => {
      dispatch(updateTodo(todo));
    },
    [dispatch]
  );

  const filteredTodos = useMemo(() => {
    const q = searchQuery.trim();
    if (!q) return todos;
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    return todos.filter(todo => {
      const title = (todo.title || '').toLowerCase();
      return terms.every(term => title.includes(term));
    });
  }, [todos, searchQuery]);

  const handleGetTodosFromServer = useCallback(async () => {
    getTodos()
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
  }, [dispatch, enqueueSnackbar]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoTitle(e.target.value);
  };
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoDescription(e.target.value);
  };

  const handleClearFields = () => {
    setNewTodoTitle('');
    setNewTodoDescription('');
  };

  const handldeAddTodo = async () => {
    try {
      if (!user?.access_token) return;

      const newTodo: CreateTodoType = {
        title: newTodoTitle,
        description: newTodoDescription.trim() ? newTodoDescription : ' ',
      };
      await createTodo(newTodo);
      handleClearFields();
      await handleGetTodosFromServer();
    } catch (error) {
      console.log(error);
      enqueueSnackbar('Error adding todo', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTestTasks = async () => {
    try {
      if (!user?.access_token) return;
      setIsLoading(true);
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
      await handleGetTodosFromServer();
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Error creating test tasks', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!user?.access_token) return;
    handleGetTodosFromServer();
  }, [handleGetTodosFromServer, user?.access_token]);

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

      {/*Search by title sorting list */}
      <Paper elevation={24} sx={{ padding: 4, margin: 2, marginTop: 4 }}>
        <Stack
          direction="row"
          spacing={2}
          sx={{
            width: '100%',
            alignItems: 'center',
          }}
        >
          <Input
            sx={{
              width: '100%',
            }}
            placeholder="Search title (multi-term), e.g. 'buy milk'"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            inputProps={{ 'aria-label': 'search todos by title' }}
          />
          <Button
            variant="outlined"
            onClick={() => setSearchQuery('')}
            disabled={!searchQuery}
          >
            Clear
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
        {filteredTodos.map(todo => {
          return <Todo todo={todo} key={todo._id} setTodo={setTodo} />;
        })}
      </Grid>
    </Box>
  );
};
export default Todos;
