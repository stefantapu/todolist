import { useState } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import type { TodoType } from '../model/todoType';
import Checkbox from '@mui/material/Checkbox';
import { mockTodos } from '../model/mockTodos';
type TodoProps = {
  todo: TodoType;
  setTodo: (todo: TodoType) => void;
};

const Todo = ({ todo, setTodo }: TodoProps) => {
  const handleCheckClick = () => {
    setTodo({ ...todo, completed: !todo.completed });
  };
  return (
    <Card variant="outlined" sx={{ minWidth: 275, maxWidth: 375 }}>
      <CardContent>
        <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
          {todo.title}
        </Typography>
        <Typography variant="body2">{todo.description}</Typography>
      </CardContent>
      <CardActions>
        <Checkbox checked={todo.completed} onClick={handleCheckClick} />
      </CardActions>
    </Card>
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
    <Stack flexWrap={'wrap'} spacing={2} direction={'row'} padding={2}>
      {todos.map(todo => {
        return <Todo todo={todo} key={todo._id} setTodo={setTodo} />;
      })}
    </Stack>
  );
};
export default Todos;
