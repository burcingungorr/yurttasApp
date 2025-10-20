import { configureStore } from '@reduxjs/toolkit';
import usernameReducer from './usernameSlice';
import roomReducer from './roomSlice';

export const store = configureStore({
  reducer: {
    username: usernameReducer,
    room:roomReducer,


  },
});
