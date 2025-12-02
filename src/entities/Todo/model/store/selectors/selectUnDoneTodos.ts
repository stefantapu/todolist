import { createSelector } from '@reduxjs/toolkit';
import { selectTodos } from '../todosStore';

export const selectUnDoneTodos = createSelector([selectTodos], todos =>
  todos.filter(todo => !todo.completed)
);

export const selectUnDoneTodosLenght = createSelector(
  [selectUnDoneTodos],
  todos => todos.length
);
