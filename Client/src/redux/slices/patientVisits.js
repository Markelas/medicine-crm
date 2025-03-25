import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios';
import { TOKEN } from '../../consts';

// Получение списка пациентов
export const fetchPatients = createAsyncThunk(
   'patients/fetchPatients',
   async (searchQuery = '') => {
      const { data } = await axios.get('/patient-cards', {
         params: { search: searchQuery },
         headers: { Authorization: TOKEN },
      });
      return data;
   },
);

// Получение списка болезней
export const fetchDiseases = createAsyncThunk(
   'diseases/fetchDiseases',
   async ({ search = '', noPagination = true }) => {
      const { data } = await axios.get('diseases', {
         params: { search, noPagination }, // Отключаем пагинацию
      });
      return data.diseases; // Возвращаем только массив заболеваний
   },
);

// Добавление визита пациента
export const createPatientVisit = createAsyncThunk(
   'patientVisits/createPatientVisit',
   async ({ patientId, visitData }) => {
      const { data } = await axios.post(
         `/patients/${patientId}/diseases`,
         visitData,
         { headers: { Authorization: TOKEN } },
      );
      return data;
   },
);

const initialState = {
   patients: {
      items: [],
      status: 'loading',
   },
   diseases: {
      items: [],
      status: 'loading',
   },
   patientVisits: {
      status: 'idle',
   },
};

const patientVisitsSlice = createSlice({
   name: 'patientVisits',
   initialState,
   reducers: {},
   extraReducers: (builder) => {
      builder
         .addCase(fetchPatients.pending, (state) => {
            state.patients.items = [];
            state.patients.status = 'loading';
         })
         .addCase(fetchPatients.fulfilled, (state, action) => {
            state.patients.items = action.payload;
            state.patients.status = 'loaded';
         })
         .addCase(fetchPatients.rejected, (state) => {
            state.patients.items = [];
            state.patients.status = 'error';
         })
         .addCase(fetchDiseases.pending, (state) => {
            state.diseases.items = [];
            state.diseases.status = 'loading';
         })
         .addCase(fetchDiseases.fulfilled, (state, action) => {
            state.diseases.items = action.payload;
            state.diseases.status = 'loaded';
         })
         .addCase(fetchDiseases.rejected, (state) => {
            state.diseases.items = [];
            state.diseases.status = 'error';
         })
         .addCase(createPatientVisit.pending, (state) => {
            state.patientVisits.status = 'loading';
         })
         .addCase(createPatientVisit.fulfilled, (state) => {
            state.patientVisits.status = 'succeeded';
         })
         .addCase(createPatientVisit.rejected, (state) => {
            state.patientVisits.status = 'error';
         });
   },
});

export const patientVisitsReducer = patientVisitsSlice.reducer;
