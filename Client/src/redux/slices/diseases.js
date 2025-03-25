import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios';
import { TOKEN } from '../../consts';

// AsyncThunk для получения списка заболеваний
export const fetchDiseases = createAsyncThunk(
   'diseases/fetchDiseases',
   async ({ search = '', page = 1, limit = 30 }) => {
      const { data } = await axios.get('diseases', {
         headers: {
            Authorization: TOKEN,
         },
         params: { search, page, limit },
      });
      return data;
   },
);

export const fetchRemoveDisease = createAsyncThunk(
   'diseases/fetchRemoveDisease',
   async (code) =>
      axios.delete(`/diseases/${code}`, {
         headers: { Authorization: TOKEN },
      }),
);

const initialState = {
   diseases: {
      items: [],
      status: 'loading',
      totalDiseases: 0,
      totalPages: 1,
      currentPage: 1,
   },
};

const diseasesSlice = createSlice({
   name: 'diseases',
   initialState,
   reducers: {},
   extraReducers: {
      [fetchDiseases.pending]: (state) => {
         state.diseases.items = [];
         state.diseases.status = 'loading';
      },
      [fetchDiseases.fulfilled]: (state, action) => {
         const { diseases, totalDiseases, totalPages, currentPage } =
            action.payload;
         state.diseases.items = diseases;
         state.diseases.status = 'loaded';
         state.diseases.totalDiseases = totalDiseases;
         state.diseases.totalPages = totalPages;
         state.diseases.currentPage = currentPage;
      },
      [fetchDiseases.rejected]: (state) => {
         state.diseases.items = [];
         state.diseases.status = 'error';
      },

      [fetchRemoveDisease.pending]: (state, action) => {
         state.diseases.items = state.diseases.items.filter(
            (disease) => disease._id !== action.meta.arg,
         );
      },
      [fetchRemoveDisease.rejected]: (state) => {
         state.diseases.status = 'error';
      },
   },
});

export const diseasesReducer = diseasesSlice.reducer;
