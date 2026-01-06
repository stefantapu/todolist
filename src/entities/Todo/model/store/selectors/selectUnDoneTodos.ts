import { createSelector } from '@reduxjs/toolkit';
import { todoApiRTK } from '../../../api/todoApi';

export const selectUnDoneTodos = createSelector(
  [todoApiRTK.endpoints.getAllTodos.select()],
  result => result.data?.filter(todo => !todo.completed) ?? []
);

export const selectUnDoneTodosLenght = createSelector(
  [selectUnDoneTodos],
  todos => todos.length
);
