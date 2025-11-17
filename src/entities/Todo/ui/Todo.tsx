import { useState, useRef } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import type { TodoType } from '../model/todoType';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import { Grid, Paper, Stack, TextField } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useTodosStore } from '../model/store/useTodosStore';

type TodoProps = {
  todo: TodoType;
  setTodo?: (todo: TodoType) => void;
};

export const Todo = ({ todo, setTodo }: TodoProps) => {
  const deleteTodo = useTodosStore(state => state.deleteTodo);

  const { enqueueSnackbar } = useSnackbar();
  const [editingField, setEditingField] = useState<
    'title' | 'description' | null
  >(null);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [editedDescription, setEditedDescription] = useState(todo.description);
  const inputRef = useRef<HTMLInputElement>(null);

  const saveChanges = () => {
    setTodo?.({
      ...todo,
      title: editedTitle,
      description: editedDescription,
      updatedAt: new Date().toISOString(),
    });
    setEditingField(null);
    enqueueSnackbar('Saved!', { variant: 'success' });
  };

  const handleCheckClick = () => {
    setTodo?.({ ...todo, completed: !todo.completed });
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        width: 'min(50%, 500px)',
        height: '100%',
      }}
    >
      <Paper elevation={16} sx={{ padding: 2, height: '100%' }}>
        <Stack spacing={4} sx={{ height: '100%' }}>
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
                inputRef={inputRef} // Attach the ref to the TextField
                value={editedTitle}
                variant="standard"
                onChange={e => setEditedTitle(e.target.value)}
                onBlur={saveChanges}
                onFocus={() => {
                  // Set cursor position to the end when focused
                  if (inputRef.current) {
                    inputRef.current.setSelectionRange(
                      editedTitle.length,
                      editedTitle.length
                    );
                  }
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter') saveChanges();
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
                      fontSize: 26,
                      padding: 0,
                      margin: 0,
                      lineHeight: 1.6,
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
                    fontSize: 26,
                    width: 'auto',
                  }}
                  onDoubleClick={() => {
                    setEditedTitle(todo.title);
                    setEditingField('title');
                  }}
                >
                  {todo.title}
                </Typography>
                <Checkbox
                  checked={todo.completed}
                  onClick={handleCheckClick} // переключаем completed при клике
                />
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
                onBlur={saveChanges}
                onKeyDown={e => {
                  if (e.key === 'Enter') saveChanges();
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
                  console.log('Double clicked description');
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
                fontSize: 10,
              }}
            >
              Created: {new Date(todo.createdAt).toLocaleDateString()}
              <br />
              Modified: {new Date(todo.updatedAt).toLocaleDateString()}
            </Typography>
            <IconButton
              aria-label="delete"
              onClick={() => deleteTodo(todo._id)}
            >
              <DeleteIcon></DeleteIcon>
            </IconButton>
          </Grid>
        </Stack>
      </Paper>
    </Box>
  );
};
