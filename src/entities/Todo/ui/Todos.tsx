import Box from '@mui/material/Box';
import { Grid, Input } from '@mui/material';
import { useTodosStore } from '../model/store/useTodosStore';
import { Todo } from './Todo';
import { useState } from 'react';

//  Корневой компонент списка задач
const Todos = () => {
  //   const [todos, setTodos] = useState<TodoType[]>(mockTodos);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoDescription, setNewTodoDescription] = useState('');

  const todos = useTodosStore(state => state.todos);

  //   // Функция для обновления одной задачи в массиве:
  //   // проходит по всем задачам и заменяет ту, у которой совпадает _id
  //   const setTodo = (todo: TodoType) => {
  //     const updateTodos = todos.map((t: TodoType) => {
  //       if (t._id === todo._id) {
  //         return todo; // возвращаем обновлённую задачу
  //       }
  //       return t; // остальные оставляем без изменений
  //     });
  //     setTodos(updateTodos); // обновляем стейт
  //   };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoTitle(e.target.value);
  };
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoDescription(e.target.value);
  };

  return (
    // Контейнер для сетки карточек
    <Box sx={{ flexGrow: 1 }}>
      <Input
        placeholder="title"
        value={newTodoTitle}
        onChange={handleTitleChange}
      />
      <Input
        placeholder="description"
        value={newTodoDescription}
        onChange={handleDescriptionChange}
      />

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
        {/* Рендерим каждую задачу через компонент Todo */}
        {todos.map(todo => {
          return <Todo todo={todo} key={todo._id} />;
        })}
      </Grid>
    </Box>
  );
};
export default Todos;
