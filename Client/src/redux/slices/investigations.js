import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios';
import { TOKEN } from '../../consts';

export const fetchInvestigations = createAsyncThunk(
   'investigations/fetchInvestigations',
   async () => {
      const { data } = await axios.get('investigations', {
         headers: { Authorization: TOKEN },
      });
      return data;
   },
);

export const fetchRemoveInvestigation = createAsyncThunk(
   'investigations/fetchRemoveInvestigation',
   async (id) =>
      axios.delete(`/investigations/${id}`, {
         headers: { Authorization: TOKEN },
      }),
);

const initialState = {
   investigations: {
      items: [],
      status: 'loading',
   },
};

const investigationsSlice = createSlice({
   name: 'investigations',
   initialState,
   reducers: {},
   extraReducers: {
      [fetchInvestigations.pending]: (state) => {
         state.investigations.items = [];
         state.investigations.status = 'loading';
      },
      [fetchInvestigations.fulfilled]: (state, action) => {
         state.investigations.items = action.payload;
         state.investigations.status = 'loaded';
      },
      [fetchInvestigations.rejected]: (state) => {
         state.investigations.items = [];
         state.investigations.status = 'error';
      },

      [fetchRemoveInvestigation.pending]: (state, action) => {
         state.investigations.items = state.investigations.items.filter(
            (item) => item._id !== action.meta.arg,
         );
      },
   },
});

export const investigationsReducer = investigationsSlice.reducer;
