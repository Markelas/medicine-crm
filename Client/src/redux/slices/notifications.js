import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios';
import { TOKEN } from '../../consts';

// AsyncThunk для получения списка извещений
export const fetchNotifications = createAsyncThunk(
   'notifications/fetchNotifications',
   async () => {
      const { data } = await axios.get('notifications', {
         headers: {
            Authorization: TOKEN,
         },
      });
      return data;
   },
);

// AsyncThunk для удаления извещения
export const fetchRemoveNotification = createAsyncThunk(
   'notifications/fetchRemoveNotification',
   async (id) =>
      axios.delete(`/notifications/${id}`, {
         headers: { Authorization: TOKEN },
      }),
);

const initialState = {
   notifications: {
      items: [],
      status: 'loading', // Изначально статус загрузки
   },
};

const notificationsSlice = createSlice({
   name: 'notifications',
   initialState,
   reducers: {},
   extraReducers: {
      // Получение списка извещений
      [fetchNotifications.pending]: (state) => {
         state.notifications.items = [];
         state.notifications.status = 'loading';
      },
      [fetchNotifications.fulfilled]: (state, action) => {
         state.notifications.items = action.payload;
         state.notifications.status = 'loaded';
      },
      [fetchNotifications.rejected]: (state) => {
         state.notifications.items = [];
         state.notifications.status = 'error';
      },

      // Удаление извещения
      [fetchRemoveNotification.pending]: (state, action) => {
         state.notifications.items = state.notifications.items.filter(
            (notification) => notification._id !== action.meta.arg,
         );
      },
      [fetchRemoveNotification.rejected]: (state) => {
         state.notifications.status = 'error';
      },
   },
});

export const notificationsReducer = notificationsSlice.reducer;
