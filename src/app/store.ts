import { configureStore } from '@reduxjs/toolkit';
import { userStore } from '../entities/User/model/store/userStore';

export const store = configureStore({
  reducer: {
    user: userStore.reducer,
  },
});
