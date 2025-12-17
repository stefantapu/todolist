import { useState, useRef, memo } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { NavLink, useNavigate } from 'react-router-dom';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import type { CreateTodoType, TodoType } from '../model/todoType';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import { Grid, Paper, Stack, TextField } from '@mui/material';
import { useSnackbar } from 'notistack';
import {
  deleteTodo,
  editTodoCompleted,
  editTodoTitleAndDescription,
  getTodos,
} from '../api/todoApi';
import { useAppDispatch, useAppSelector } from '../../../app/store';
import { selectFilters, setTodos } from '../model/store/todosStore';
import { formatDistanceToNow } from 'date-fns';

type TodoProps = {
  todo: TodoType;
  setTodo?: (todo: TodoType) => void;
  variant?: 'card' | 'fullpage';
};

export const Todo = memo(({ todo, setTodo, variant = 'card' }: TodoProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const filters = useAppSelector(selectFilters);
  const { enqueueSnackbar } = useSnackbar();
  const [editingField, setEditingField] = useState<'title' | 'description' | null>(null);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [editedDescription, setEditedDescription] = useState(todo.description);
  const inputRef = useRef<HTMLInputElement>(null);

  const isFull = variant === 'fullpage';

  const handleEditTodo = async () => {
    // If nothing changed
    if (editedTitle === todo.title && editedDescription === todo.description) {
      setEditingField(null);
      enqueueSnackbar('No changes', { variant: 'info' });
      return;
    }

    try {
      const newTodo: CreateTodoType = {
        title: editedTitle,
        description: editedDescription,
      };

      // send patch and use returned todo to update local and global state
      const res = await editTodoTitleAndDescription(newTodo, todo._id);
      const updatedTodo: TodoType = res?.data ?? { ...todo, ...newTodo };

      // update global list
      const allRes = await getTodos(filters);
      dispatch(setTodos(allRes.data || []));

      // update page-local todo if parent passed setter (optimistic / local sync)
      setTodo?.(updatedTodo);

      // also update local edit fields to match saved data
      setEditedTitle(updatedTodo.title);
      setEditedDescription(updatedTodo.description);

      setEditingField(null);
      enqueueSnackbar('Saved!', { variant: 'success' });
    } catch (error) {
      console.error('Failed to edit todo:', error);
      enqueueSnackbar('Failed to save todo', { variant: 'error' });
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      await deleteTodo(id);
      const response = await getTodos(filters);
      dispatch(setTodos(response.data || []));
      enqueueSnackbar('Task deleted!', { variant: 'success' });
    } catch (error) {
      console.error('Failed to delete todo:', error);
      enqueueSnackbar('Failed to delete todo', { variant: 'error' });
    }
  };

  const handleCompleted = async (completed: boolean) => {
    try {
      await editTodoCompleted(completed, todo._id);
      const response = await getTodos(filters);
      dispatch(setTodos(response.data || []));
      if (completed) {
        enqueueSnackbar('Nice!', { variant: 'success' });
      } else {
        enqueueSnackbar('Updated!', { variant: 'default' });
      }
    } catch (error) {
      console.error('Failed to update completed state:', error);
      enqueueSnackbar('Failed to update todo', { variant: 'error' });
    }
  };

  const handleToggleCompleted = () => {
    const newCompleted = !todo.completed;
    setTodo?.({ ...todo, completed: newCompleted });
    handleCompleted(newCompleted);
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        width: isFull ? '100%' : 'min(50%, 500px)',
        height: isFull ? 'auto' : '100%',
      }}
    >
      <Paper elevation={16} sx={{ padding: isFull ? 4 : 2, height: '100%' }}>
        <Stack spacing={isFull ? 8 : 4} sx={{ height: '100%' }}>
          <Stack
            direction="row"
            sx={{
              flexWrap: 'wrap',
              alignContent: 'space-between',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            {editingField === 'title' ? (
              <TextField
                fullWidth
                autoFocus
                inputRef={inputRef}
                value={editedTitle}
                variant="standard"
                onChange={e => setEditedTitle(e.target.value)}
                onBlur={() => handleEditTodo()}
                onFocus={() => {
                  if (inputRef.current) {
                    inputRef.current.setSelectionRange(
                      editedTitle.length,
                      editedTitle.length
                    );
                  }
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleEditTodo();
                }}
                slotProps={{
                  root: { sx: { width: '100%' } },
                  input: {
                    disableUnderline: false,
                    sx: {
                      padding: 0,
                      margin: 0,
                      textAlign: 'start',
                      width: '100%',
                    },
                  },
                  htmlInput: {
                    sx: {
                      fontWeight: 500,
                      fontSize: isFull ? 36 : 26,
                      padding: 0,
                      margin: 0,
                      lineHeight: 1.2,
                      height: 'auto',
                    },
                  },
                }}
                sx={{ width: '100%' }}
              />
            ) : (
              <Stack
                direction="row"
                spacing={2}
                sx={{
                  flexWrap: 'nowrap',
                  alignContent: 'space-between',
                  justifyContent: 'space-between',
                  width: '100%',
                }}
              >
                <Typography
                  noWrap
                  variant="h6"
                  sx={{
                    fontWeight: 500,
                    cursor: 'pointer',
                    fontSize: isFull ? 36 : 26,
                    width: '100%',
                  }}
                  onDoubleClick={() => {
                    setEditedTitle(todo.title);
                    setEditingField('title');
                  }}
                >
                  {todo.title}
                </Typography>
                <div>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Checkbox checked={todo.completed} onClick={handleToggleCompleted} />
                    {isFull ? (
                      <div></div>
                    ) : (
                      <NavLink to={`/todo/${todo._id}`}>
                        <IconButton
                          aria-label="open todo"
                          size="small"
                          // onClick={() => navigate(`/todo/${todo._id}`)} //No link when hovering
                        >
                          <OpenInNewIcon fontSize="small" />
                        </IconButton>
                      </NavLink>
                    )}
                  </Box>
                </div>
              </Stack>
            )}
          </Stack>

          <Stack sx={{ display: 'inline-block' }}>
            {editingField === 'description' ? (
              <TextField
                multiline
                autoFocus
                fullWidth
                value={editedDescription}
                variant="standard"
                onChange={e => setEditedDescription(e.target.value)}
                onBlur={() => handleEditTodo()}
                onKeyDown={e => {
                  if (e.key === 'Enter' && e.ctrlKey) handleEditTodo();
                }}
                slotProps={{
                  input: {
                    sx: {
                      display: 'block',
                      width: '100%',
                      fontWeight: 300,
                      fontSize: 16,
                      lineHeight: 1.5,
                      padding: 0,
                      margin: 0,
                      resize: 'none',
                    },
                  },
                  root: {
                    sx: {
                      display: 'block',
                      width: '100%',
                    },
                  },
                }}
                sx={{
                  '& .MuiInput-underline:before, & .MuiInput-underline:after': {
                    display: 'none',
                  },
                }}
              />
            ) : (
              <Typography
                variant="body1"
                sx={{
                  cursor: 'pointer',
                  fontWeight: 300,
                  fontSize: 16,
                  lineHeight: 1.5,
                  whiteSpace: 'pre-wrap', // matches multiline textfield behavior
                }}
                onDoubleClick={() => {
                  setEditedDescription(todo.description);
                  setEditingField('description');
                }}
              >
                {todo.description}
              </Typography>
            )}
          </Stack>

          <Grid
            container
            direction="row"
            sx={{
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                color: 'text.secondary',
                fontSize: isFull ? 18 : 14,
              }}
            >
              {formatDistanceToNow(todo.updatedAt)}
            </Typography>
            <IconButton
              aria-label="delete"
              onClick={() => {
                handleDeleteTodo(todo._id);
                navigate(`/`);
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Grid>
        </Stack>
      </Paper>
    </Box>
  );
});
