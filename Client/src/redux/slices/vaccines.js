import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios';
import { TOKEN } from '../../consts';

// AsyncThunk для получения списка вакцин
export const fetchVaccines = createAsyncThunk(
   'vaccines/fetchVaccines',
   async ({ search = '', page = 1, limit = 30 }) => {
      const { data } = await axios.get('vaccines', {
         headers: {
            Authorization: TOKEN,
         },
         params: { search, page, limit },
      });
      console.log(data);
      // Извлекаем только массив вакцин из полученных данных
      return {
         vaccines: data.vaccines, // Массив вакцин
         totalVaccines: data.totalVaccines, // Общее количество вакцин
         currentPage: data.currentPage, // Текущая страница
         totalPages: data.totalPages, // Общее количество страниц
      };
   },
);

// AsyncThunk для удаления вакцины
export const fetchRemoveVaccine = createAsyncThunk(
   'vaccines/fetchRemoveVaccine',
   async (id) =>
      axios.delete(`/vaccines/${id}`, {
         headers: { Authorization: TOKEN },
      }),
);

const initialState = {
   vaccines: {
      items: [],
      status: 'loading', // Изначально статус загрузки
      totalVaccines: 0, // Общее количество вакцин
      totalPages: 1, // Общее количество страниц
      currentPage: 1, // Текущая страница
   },
};

const vaccinesSlice = createSlice({
   name: 'vaccines',
   initialState,
   reducers: {},
   extraReducers: {
      // Получение списка вакцин
      [fetchVaccines.pending]: (state) => {
         state.vaccines.items = [];
         state.vaccines.status = 'loading';
      },
      [fetchVaccines.fulfilled]: (state, action) => {
         const { vaccines, totalVaccines, totalPages, currentPage } =
            action.payload;
         state.vaccines.items = vaccines;
         state.vaccines.status = 'loaded';
         state.vaccines.totalVaccines = totalVaccines;
         state.vaccines.totalPages = totalPages;
         state.vaccines.currentPage = currentPage;
      },
      [fetchVaccines.rejected]: (state) => {
         state.vaccines.items = [];
         state.vaccines.status = 'error';
      },

      // Удаление вакцины
      [fetchRemoveVaccine.pending]: (state, action) => {
         state.vaccines.items = state.vaccines.items.filter(
            (vaccine) => vaccine._id !== action.meta.arg,
         );
      },
      [fetchRemoveVaccine.rejected]: (state) => {
         state.vaccines.status = 'error';
      },
   },
});

export const vaccinesReducer = vaccinesSlice.reducer;
