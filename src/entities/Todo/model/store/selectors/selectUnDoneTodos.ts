import { createSelector } from '@reduxjs/toolkit';
import { todoApiRTK } from '../../../api/todoApi';

export const selectUnDoneTodos = createSelector(
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  [todoApiRTK.endpoints.getTodos.select()],
  todos => todos.data?.filter(todo => !todo.completed)
);

export const selectUnDoneTodosLenght = createSelector(
  [selectUnDoneTodos],
  todos => todos?.length || 0
);
