import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios';
import { TOKEN } from '../../consts';

// Асинхронный запрос с параметром поиска
export const fetchPatientCards = createAsyncThunk(
   'patientCards/fetchPatientCards',
   async (searchQuery = '') => {
      const { data } = await axios.get('patient-cards', {
         params: { search: searchQuery }, // Передаем search как параметр запроса
         headers: {
            Authorization: TOKEN,
         },
      });
      return data;
   },
);

export const fetchRemovePatientCard = createAsyncThunk(
   'patientCards/fetchRemovePatientCard',
   async (id) =>
      axios.delete(`/patient-cards/${id}`, {
         headers: { Authorization: TOKEN },
      }),
);

const initialState = {
   patientCards: {
      items: [],
      status: 'loading', // Изначально обозначаем, что идет загрузка
   },
};

const patientCardsSlice = createSlice({
   name: 'patientCards',
   initialState,
   reducers: {},
   extraReducers: {
      // Получение карт пациентов
      [fetchPatientCards.pending]: (state) => {
         state.patientCards.items = [];
         state.patientCards.status = 'loading';
      },
      [fetchPatientCards.fulfilled]: (state, action) => {
         state.patientCards.items = action.payload;
         state.patientCards.status = 'loaded';
      },
      [fetchPatientCards.rejected]: (state) => {
         state.patientCards.items = [];
         state.patientCards.status = 'error';
      },

      // Удаление карты пациента
      [fetchRemovePatientCard.pending]: (state, action) => {
         state.patientCards.items = state.patientCards.items.filter(
            (obj) => obj._id !== action.meta.arg,
         );
      },
      [fetchRemovePatientCard.rejected]: (state) => {
         state.patientCards.status = 'error';
      },
   },
});

export const patientCardsReducer = patientCardsSlice.reducer;
