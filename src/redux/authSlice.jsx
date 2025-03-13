import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

const COOKIE_EXPIRATION_DAYS = 1; 

const initialState = {
  token: Cookies.get('token') || null,
  role: Cookies.get('role') || null,  
  user: (() => {
    try {
      return JSON.parse(Cookies.get('user') || null) || null; 
    } catch (error) {
      return null;
    }
  })(),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth(state, action) {
      state.token = action.payload.token;
      state.role = action.payload.role;  
      state.user = action.payload.user;

      Cookies.set('token', action.payload.token, { expires: COOKIE_EXPIRATION_DAYS });
      Cookies.set('role', action.payload.role, { expires: COOKIE_EXPIRATION_DAYS });
      Cookies.set('user', JSON.stringify(action.payload.user), { expires: COOKIE_EXPIRATION_DAYS });
    },
    clearAuth(state) {
      state.token = null;
      state.role = null;
      state.user = null;

      Cookies.remove('token');
      Cookies.remove('role'); 
      Cookies.remove('user');
    },
  },
});

export const { setAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;
