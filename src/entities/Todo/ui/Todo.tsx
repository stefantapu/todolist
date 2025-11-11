import { useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import type { TodoType } from '../model/todoType';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import { Grid, Stack, TextField } from '@mui/material';
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
        boxShadow: '0 0 10px lightgray',
        padding: 2,
        borderRadius: 1,
        width: 'fit-content', // allow it to grow/shrink with parent
        minWidth: 0, // allow children to shrink in flex layouts
      }}
    >
      <Stack spacing={2}>
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
              value={editedTitle}
              variant="standard"
              onChange={e => setEditedTitle(e.target.value)}
              onBlur={saveChanges}
              onKeyDown={e => {
                if (e.key === 'Enter') saveChanges();
              }}
              slotProps={{
                input: {
                  disableUnderline: false,
                  sx: {
                    padding: 0,
                    margin: 0,
                    textAlign: 'start',
                  },
                },
                htmlInput: {
                  sx: {
                    fontWeight: 500,
                    fontSize: 26,
                    padding: 0,
                    margin: 0,
                    height: 'auto',
                    lineHeight: 1.6,
                  },
                },
              }}
              sx={{}}
            />
          ) : (
            <Stack
              direction="row"
              spacing={2}
              sx={{
                flexWrap: 'wrap',
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

        <Stack>
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
              sx={{
                minWidth: 0, // important for flex shrink
                '& .MuiInputBase-input': {
                  fontWeight: 300,
                  fontSize: 16,
                  padding: 0,
                  margin: 0,
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
          <IconButton aria-label="delete" onClick={() => deleteTodo(todo._id)}>
            <DeleteIcon></DeleteIcon>
          </IconButton>
        </Grid>
      </Stack>
    </Box>
  );
};
