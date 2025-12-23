import { createSelector } from '@reduxjs/toolkit';
import { todoApiRTK } from '../../../api/todoApi';

export const selectUnDoneTodos = createSelector(
  // @ts-ignore
  [todoApiRTK.endpoints.getTodos.select()],
  todos => todos.data?.filter(todo => !todo.completed)
);

export const selectUnDoneTodosLenght = createSelector(
  [selectUnDoneTodos],
  todos => todos?.length || 0
);
