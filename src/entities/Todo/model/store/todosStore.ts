import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { mockTodos } from '../mockTodos';
import type { TodoType } from '../todoType';

type TodosStore = {
  todos: TodoType[];
  isLoading: boolean;
};

const initialState: TodosStore = {
  todos: mockTodos,
  isLoading: false,
};

export const todosStore = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    setTodos: (state, action: PayloadAction<TodoType[]>) => {
      // don't mutate action.payload (may be frozen) — copy then sort
      state.todos = [...action.payload].sort((a, b) => a.order - b.order);
    },
    addTodo: (state, action: PayloadAction<TodoType>) => {
      state.todos.push(action.payload);
    },
    removeTodo: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter(todo => todo._id !== action.payload);
    },
    updateTodo: (state, action: PayloadAction<TodoType>) => {
      const index = state.todos.findIndex(
        todo => todo._id === action.payload._id
      );
      if (index !== -1) state.todos[index] = action.payload;
      state.todos.sort((a, b) => a.order - b.order);
    },
    updateTodoCompleted: (
      state,
      action: PayloadAction<{ id: string; completed: boolean }>
    ) => {
      const index = state.todos.findIndex(
        todo => todo._id === action.payload.id
      );
      if (index !== -1) {
        state.todos[index].completed = action.payload.completed;
      }
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setTodos, addTodo, removeTodo, updateTodo, setIsLoading } =
  todosStore.actions;

export const selectTodos = (state: { todos: TodosStore }) =>
  state.todos.todos;
export const selectTodosLoading = (state: { todos: TodosStore }) =>
  state.todos.isLoading;

export default todosStore.reducer;
