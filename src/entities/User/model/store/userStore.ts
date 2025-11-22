import { createSlice } from '@reduxjs/toolkit';

export const userStore = createSlice({
  name: 'user',
  initialState: {
    user: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    removeUser: state => {
      state.user = null;
    },
  },
  selectors: {
    selectUser: state => state.user,
  },
});

// Action creators are generated for each case reducer function
export const { setUser, removeUser } = userStore.actions;
export const { selectUser } = userStore.selectors;
