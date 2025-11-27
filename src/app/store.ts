import { configureStore } from '@reduxjs/toolkit';
import { userStore } from '../entities/User/model/store/userStore';
import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from 'react-redux';

export const store = configureStore({
  reducer: {
    userSlice: userStore.reducer,
    // todo: userStore.reducer,
  },
});

// // Infer the `RootState`,  `AppDispatch`, and `AppStore` types from the store itself
// export type RootState = ReturnType<typeof store.getState>
// // Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
// export type AppDispatch = typeof store.dispatch
// export type AppStore = typeof store

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

// export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
// export const useAppSelector = useSelector.withTypes<RootState>()

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
// export const useAppStore: () => AppStore = useStore;
