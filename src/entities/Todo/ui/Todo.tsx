import { memo } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { NavLink } from 'react-router-dom';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import type { CheckTodoType, EditTodoType, TodoType } from '../model/todoType';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import { Grid, Paper, Stack, TextField } from '@mui/material';
import { useSnackbar } from 'notistack';
import useEditMode from './useEditMode';
import {
  useCheckTodoMutation,
  useDeleteTodoMutation,
  useEditTodoMutation,
} from '../api/todoApi';
import { formatDistanceToNow } from 'date-fns';

type TodoProps = {
  todo: TodoType;
  variant?: 'card' | 'fullpage';
};

export const Todo = memo(({ todo, variant = 'card' }: TodoProps) => {
  const { enqueueSnackbar } = useSnackbar();

  // RTK mutations (need to be called before using the hook's onSave)
  const [editTodoTitleAndDescription] = useEditTodoMutation();
  const [checkTodo] = useCheckTodoMutation();
  const [deleteTodoRTK] = useDeleteTodoMutation();

  const {
    editingField,
    editedTitle,
    editedDescription,
    setEditedTitle,
    setEditedDescription,
    startEditing,
    saveEditing,
    inputRef,
  } = useEditMode(todo.title, todo.description, async (title, description) => {
    const newTodo: EditTodoType = { title, description, _id: todo._id };
    await editTodoTitleAndDescription(newTodo).unwrap();
  });

  const isFull = variant === 'fullpage';

  const handleSave = async () => {
    try {
      const res = await saveEditing();
      if (res === 'no-changes') {
        enqueueSnackbar('No changes', { variant: 'info' });
        return;
      }
      enqueueSnackbar('Saved!', { variant: 'success' });
    } catch (error) {
      console.error('Failed to edit todo:', error);
      enqueueSnackbar('Failed to save todo', { variant: 'error' });
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      await deleteTodoRTK(id).unwrap();
      enqueueSnackbar('Task deleted!', { variant: 'success' });
    } catch (error) {
      console.error('Failed to delete todo:', error);
      enqueueSnackbar('Failed to delete todo', { variant: 'error' });
    }
  };

  const handleCompleted = async (completed: boolean) => {
    try {
      const newCompleted: CheckTodoType = {
        _id: todo._id,
        completed: completed,
      };
      checkTodo(newCompleted);
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
                onBlur={() => handleSave()}
                onFocus={() => {
                  if (inputRef.current) {
                    inputRef.current.setSelectionRange(
                      editedTitle.length,
                      editedTitle.length
                    );
                  }
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleSave();
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
                    startEditing('title');
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
                        <IconButton aria-label="open todo" size="small">
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
                onBlur={() => handleSave()}
                onKeyDown={e => {
                  if (e.key === 'Enter' && e.ctrlKey) handleSave();
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
                  startEditing('description');
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
              {`Updated: ${formatDistanceToNow(todo.updatedAt)} ago`}
            </Typography>
            <IconButton
              aria-label="delete"
              onClick={() => {
                handleDeleteTodo(todo._id);
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
