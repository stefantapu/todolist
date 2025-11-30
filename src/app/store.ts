import { configureStore } from '@reduxjs/toolkit';
import { userStore } from '../entities/User/model/store/userStore';
import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from 'react-redux';
import { todosStore } from '../entities/Todo/model/store/todosStore';

export const store = configureStore({
  reducer: {
    [userStore.name]: userStore.reducer,
    [todosStore.name]: todosStore.reducer,
  },
});

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
