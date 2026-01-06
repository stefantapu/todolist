import { configureStore } from '@reduxjs/toolkit';
import { userStore } from '../entities/User/model/store/userStore';
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import { todosStore } from '../entities/Todo/model/store/todosStore';
import { todoApiRTK } from '../entities/Todo/api/todoApi';
import { rtkApi } from '../shared/api/rtkAPI';

export const store = configureStore({
  reducer: {
    [userStore.name]: userStore.reducer,
    [todosStore.name]: todosStore.reducer,
    [rtkApi.reducerPath]: rtkApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(todoApiRTK.middleware),
});

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
