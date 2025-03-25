import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios';
import { TOKEN } from '../../consts';

export const fetchAuth = createAsyncThunk('auth/fetchAuth', async (params) => {
   const { data } = await axios.post('/auth/login', params, {
      headers: {
         Authorization: TOKEN,
      },
   });
   return data;
});

export const fetchRegister = createAsyncThunk(
   'auth/fetchRegister',
   async (params) => {
      const { data } = await axios.post('/auth/register', params, {
         headers: {
            Authorization: TOKEN,
         },
      });
      return data;
   },
);

// Запрос, активен ли пользователь
export const fetchAuthMe = createAsyncThunk(
   'auth/fetchAuthMe',
   async (params) => {
      const { data } = await axios.get('/auth/me');
      return data;
   },
);

const initialState = {
   data: null,
   status: 'loading',
};

const authSlice = createSlice({
   name: 'auth',
   initialState,
   reducers: {
      logout: (state) => {
         state.data = null;
      },
   },
   extraReducers: {
      [fetchAuth.pending]: (state) => {
         state.status = 'loading';
         state.data = null;
      },
      [fetchAuth.fulfilled]: (state, action) => {
         state.status = 'loaded';
         state.data = action.payload;
      },
      [fetchAuth.rejected]: (state) => {
         state.status = 'error';
         state.data = null;
      },
      [fetchAuthMe.pending]: (state) => {
         state.status = 'loading';
         state.data = null;
      },
      [fetchAuthMe.fulfilled]: (state, action) => {
         state.status = 'loaded';
         state.data = action.payload;
      },
      [fetchAuthMe.rejected]: (state) => {
         state.status = 'error';
         state.data = null;
      },
      [fetchRegister.pending]: (state) => {
         state.status = 'loading';
         state.data = null;
      },
      [fetchRegister.fulfilled]: (state, action) => {
         state.status = 'loaded';
         state.data = action.payload;
      },
      [fetchRegister.rejected]: (state) => {
         state.status = 'error';
         state.data = null;
      },
   },
});

export const selectIsAuth = (state) => !!state.auth.data;

export const selectIsAdmin = (state) => state.auth.data?.isAdmin;

export const selectFullName = (state) => state.auth.data?.fullName;

export const authReducer = authSlice.reducer;

export const { logout } = authSlice.actions;
