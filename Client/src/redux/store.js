import { configureStore } from '@reduxjs/toolkit';
import { patientCardsReducer } from './slices/patientCards';
import { authReducer } from './slices/auth';
import { diseasesReducer } from './slices/diseases';
import { notificationsReducer } from './slices/notifications';
import { investigationsReducer } from './slices/investigations';
import { vaccinesReducer } from './slices/vaccines';
import { patientVisitsReducer } from './slices/patientVisits';

const store = configureStore({
   reducer: {
      patientCards: patientCardsReducer,
      auth: authReducer,
      diseases: diseasesReducer,
      notifications: notificationsReducer,
      investigations: investigationsReducer,
      vaccines: vaccinesReducer,
      patientVisits: patientVisitsReducer,
   },
});

export default store;
