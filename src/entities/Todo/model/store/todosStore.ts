import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { TodoType } from '../todoType';

export type TodosStore = {
  todos: TodoType[];
  isLoading: boolean;
  filters: {
    completed: 'true' | 'false' | 'all';
    page: number;
    limit: number;
    search?: string;
  };
};

const initialState: TodosStore = {
  todos: [],
  isLoading: false,
  filters: {
    completed: 'all',
    page: 1,
    limit: 6,
  },
};

export const todosStore = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    setTodos: (state, action: PayloadAction<TodoType[]>) => {
      state.todos = [...action.payload].sort((a, b) => a.order - b.order);
    },
    addTodoToStore: (state, action: PayloadAction<TodoType>) => {
      state.todos.push(action.payload);
    },
    removeTodo: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter(todo => todo._id !== action.payload);
    },
    updateTodo: (state, action: PayloadAction<TodoType>) => {
      const index = state.todos.findIndex(todo => todo._id === action.payload._id);
      if (index !== -1) state.todos[index] = action.payload;
      state.todos.sort((a, b) => a.order - b.order);
    },
    updateTodoCompleted: (
      state,
      action: PayloadAction<{ id: string; completed: boolean }>
    ) => {
      const index = state.todos.findIndex(todo => todo._id === action.payload.id);
      if (index !== -1) {
        state.todos[index].completed = action.payload.completed;
      }
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    //Filters

    setLimit: (state, action) => {
      state.filters.limit = action.payload;
    },
    setPage: (state, action) => {
      state.filters.page = action.payload;
    },
    setCompletedFilter: (state, action: PayloadAction<'all' | 'true' | 'false'>) => {
      state.filters.completed = action.payload;
    },
    setSearch: (state, action) => {
      state.filters.search = action.payload;
    },
  },

  selectors: {
    selectFilters: state => state.filters,
  },
});

export const { selectFilters } = todosStore.selectors;

export const {
  setTodos,
  addTodoToStore,
  removeTodo,
  updateTodo,
  setIsLoading,
  setCompletedFilter,
  setLimit,
  setPage,
  setSearch,
  updateTodoCompleted,
} = todosStore.actions;

export const selectTodos = (state: { todos: TodosStore }) => state.todos.todos;
export const selectTodosLoading = (state: { todos: TodosStore }) => state.todos.isLoading;

export default todosStore.reducer;
