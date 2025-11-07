import { useState } from 'react';
import Card from '@mui/material/Card';
import DeleteIcon from '@mui/icons-material/Delete';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import type { TodoType } from '../model/todoType';
import Checkbox from '@mui/material/Checkbox';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { CardHeader, Grid, TextField } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useTodosStore } from '../model/store/useTodosStore';

//  Тип пропсов компонента Todo
type TodoProps = {
  todo: TodoType;
  setTodo?: (todo: TodoType) => void;
};

//  Вложенный компонент, отвечающий за рендер одной задачи (карточки)
// Принимает объект задачи и функцию для обновления этой задачи.
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
        display: 'flex',
        flexWrap: 'wrap',
        ml: -1, // компенсируем левый отступ
        mt: -1, // компенсируем верхний отступ
        '& > :not(style)': {
          m: 1, // внутренний отступ для дочерних элементов
        },
      }}
    >
      <Paper elevation={3}>
        {/* Карточка задачи */}
        <Card variant="outlined" sx={{ minWidth: 275, maxWidth: 475 }}>
          <Grid
            container
            direction="row"
            sx={{
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 2,
            }}
          >
            <CardHeader
              title={
                editingField === 'title' ? (
                  <TextField
                    multiline
                    autoFocus
                    value={editedTitle}
                    variant="filled"
                    onChange={e => setEditedTitle(e.target.value)}
                    onBlur={saveChanges}
                    onKeyDown={e => {
                      if (e.key === 'Enter') saveChanges();
                    }}
                    slotProps={{
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
                    sx={{
                      width: { xs: '100%', sm: 200, md: 400 },
                    }}
                  />
                ) : (
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 500,
                      cursor: 'pointer',
                      fontSize: 26,
                    }}
                    onDoubleClick={() => {
                      setEditedTitle(todo.title); // Устанавливаем текущее значение заголовка
                      setEditingField('title');
                    }}
                  >
                    {todo.title}
                  </Typography>
                )
              }
              sx={{ padding: 0 }}
            />
            <Checkbox
              checked={todo.completed}
              onClick={handleCheckClick} // переключаем completed при клике
              edge="start"
            />
          </Grid>

          <CardContent>
            {editingField === 'description' ? (
              <TextField
                multiline
                autoFocus
                value={editedDescription}
                variant="standard"
                onChange={e => setEditedDescription(e.target.value)}
                onBlur={saveChanges}
                onKeyDown={e => {
                  if (e.key === 'Enter') saveChanges();
                }}
                sx={{
                  width: { xs: '100%', sm: 200 },
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
          </CardContent>
          {/* Доп. информация: даты создания и изменения */}
          <CardContent>
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
                sx={{ display: 'block', color: 'text.secondary', fontSize: 10 }}
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
          </CardContent>
        </Card>
      </Paper>
    </Box>
  );
};
