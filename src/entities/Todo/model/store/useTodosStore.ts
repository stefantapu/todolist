import { create } from 'zustand';
import { mockTodos } from '../mockTodos';
import { devtools } from 'zustand/middleware';
import type { TodoType } from '../todoType';

type TodosState = {
  todos: TodoType[];
  addTodo: (newTodo: TodoType) => void;
  setTodos: (todos: TodoType[]) => void;
  deleteTodo: (id: string) => void;
};

export const useTodosStore = create<TodosState>()(
  devtools(set => {
    return {
      todos: mockTodos,

      addTodo: (newTodo: TodoType) =>
        set(state => ({ todos: [newTodo, ...state.todos] })),

      deleteTodo: (id: string) =>
        set(state => ({
          todos: state.todos.filter(todo => todo._id !== id),
        })),

      setTodos: (todos: TodoType[]) => set({ todos }),
    };
  })
);
