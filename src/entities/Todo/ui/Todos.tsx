import { useState } from 'react';
import Card from '@mui/material/Card';

import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import type { TodoType } from '../model/todoType';
import Checkbox from '@mui/material/Checkbox';
import { mockTodos } from '../model/mockTodos';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { CardHeader, Grid } from '@mui/material';

type TodoProps = {
  todo: TodoType;
  setTodo: (todo: TodoType) => void;
};

const Todo = ({ todo, setTodo }: TodoProps) => {
  const handleCheckClick = () => {
    setTodo({ ...todo, completed: !todo.completed });
  };
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        ml: -1, // компенсируем левый отступ
        mt: -1, // компенсируем верхний отступ
        '& > :not(style)': {
          m: 1,
        },
      }}
    >
      <Paper elevation={3}>
        <Card variant="outlined" sx={{ minWidth: 275, maxWidth: 475 }}>
          <CardHeader
            title={
              <Typography variant="h6" sx={{ fontWeight: 500 }}>
                {todo.title}
              </Typography>
            }
            action={
              <Checkbox
                checked={todo.completed}
                onClick={handleCheckClick}
                edge="end"
              />
            }
            sx={{
              mr: 1,
              py: 2,
            }}
          />
          <CardContent>
            <Typography variant="body2">{todo.description}</Typography>
          </CardContent>
          <CardContent>
            <Typography
              variant="caption"
              sx={{ display: 'block', color: 'text.secondary' }}
            >
              Created: {new Date(todo.createdAt).toLocaleDateString()}
              <br />
              Modified: {new Date(todo.updatedAt).toLocaleDateString()}
            </Typography>
          </CardContent>
        </Card>
      </Paper>
    </Box>
  );
};

const Todos = () => {
  const [todos, setTodos] = useState<TodoType[]>(mockTodos);

  const setTodo = (todo: TodoType) => {
    const updateTodos = todos.map((t: TodoType) => {
      if (t._id === todo._id) {
        return todo;
      }
      return t;
    });
    setTodos(updateTodos);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid
        container
        direction="row"
        gap={2}
        sx={{
          p: 2,
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}
      >
        {todos.map(todo => {
          return <Todo todo={todo} key={todo._id} setTodo={setTodo} />;
        })}
      </Grid>
    </Box>
  );
};
export default Todos;
