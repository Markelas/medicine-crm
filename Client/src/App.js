import React from 'react';

import Container from '@mui/material/Container';

import { Sidebar } from './components';
import { Home, Registration, AddPatientCard, Login } from './pages';
import { Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchAuthMe, selectIsAuth } from './redux/slices/auth';
import { PatientCardsPage } from './pages/PatientCard/PatientCardsPage';
import { PatientCardDetails } from './pages/PatientCard/PatientCardDetails';
import { DiseasesPage } from './pages/Disease/DiseasesPage';
import { CreateDiseasePage } from './pages/Disease/CreateDiseasePage';
import { EditDiseasePage } from './pages/Disease/EditDiseasePage';
import { NotificationsPage } from './pages/Notifications/NotificationsPage';
import { InvestigationsPage } from './pages/EpidemiologicalInvestigation/InvestigationsPage';
import { AddEditInvestigation } from './pages/EpidemiologicalInvestigation/AddEditInvestigation';
import { EmergencyNotificationDetails } from './pages/Notifications/NotificationsDetails';
import { InvestigationDetails } from './pages/EpidemiologicalInvestigation/InvestigationDetails';
import './index.scss';
import { VaccinesPage } from './pages/Vaccine/VaccinesPage';
import { CreateVaccinationRecordPage } from './pages/VaccinationForPatient/VaccinationRecord';
import PatientVisitForm from './pages/PatientDiseaseRecord/PatientVisitForm';
import PrivateRoute from './PrivateRoute';
import ChangeUserRole from './pages/UserRole';
import { AddNotificationPage } from './pages/Notifications/AddNotificationPage';

function App() {
   const dispatch = useDispatch();
   const isAuth = useSelector(selectIsAuth);

   useEffect(() => {
      dispatch(fetchAuthMe());
   }, [dispatch]);

   return (
      <div className='main-layout'>
         <Sidebar />
         <div className='content'>
            <Container maxWidth='lg'>
               <Routes>
                  <Route path='/login' element={<Login />} />
                  <Route path='/register' element={<Registration />} />

                  <Route
                     path='/'
                     element={
                        <PrivateRoute>
                           <Home />
                        </PrivateRoute>
                     }
                  />
                  <Route
                     path='/patient-cards'
                     element={
                        <PrivateRoute>
                           <PatientCardsPage />
                        </PrivateRoute>
                     }
                  />
                  <Route
                     path='/patient-cards/create'
                     element={
                        <PrivateRoute>
                           <AddPatientCard />
                        </PrivateRoute>
                     }
                  />
                  <Route
                     path='/patient-cards/:id/edit'
                     element={
                        <PrivateRoute>
                           <AddPatientCard />
                        </PrivateRoute>
                     }
                  />
                  <Route
                     path='/patient-cards/:id'
                     element={
                        <PrivateRoute>
                           <PatientCardDetails />
                        </PrivateRoute>
                     }
                  />
                  <Route
                     path='/diseases'
                     element={
                        <PrivateRoute>
                           <DiseasesPage />
                        </PrivateRoute>
                     }
                  />
                  <Route
                     path='/vaccines'
                     element={
                        <PrivateRoute>
                           <VaccinesPage />
                        </PrivateRoute>
                     }
                  />
                  <Route
                     path='/notifications'
                     element={
                        <PrivateRoute>
                           <NotificationsPage />
                        </PrivateRoute>
                     }
                  />
                  <Route
                     path='/investigations'
                     element={
                        <PrivateRoute>
                           <InvestigationsPage />
                        </PrivateRoute>
                     }
                  />
                  <Route
                     path='/add-patient-vaccine'
                     element={
                        <PrivateRoute>
                           <CreateVaccinationRecordPage />
                        </PrivateRoute>
                     }
                  />
                  <Route
                     path='/patient-disease-record'
                     element={
                        <PrivateRoute>
                           <PatientVisitForm />
                        </PrivateRoute>
                     }
                  />
                  <Route
                     path='/posts/:id/edit'
                     element={
                        <PrivateRoute>
                           <AddPatientCard />
                        </PrivateRoute>
                     }
                  />
                  <Route
                     path='/diseases/create'
                     element={
                        <PrivateRoute>
                           <CreateDiseasePage />
                        </PrivateRoute>
                     }
                  />
                  <Route
                     path='/diseases/:code/edit'
                     element={
                        <PrivateRoute>
                           <EditDiseasePage />
                        </PrivateRoute>
                     }
                  />
                  <Route
                     path='/investigations/:id/details'
                     element={
                        <PrivateRoute>
                           <InvestigationDetails />
                        </PrivateRoute>
                     }
                  />
                  <Route
                     path='/notifications/:id/details'
                     element={
                        <PrivateRoute>
                           <EmergencyNotificationDetails />
                        </PrivateRoute>
                     }
                  />
                  <Route
                     path='/notifications/create'
                     element={
                        <PrivateRoute>
                           <AddNotificationPage />
                        </PrivateRoute>
                     }
                  />
                  <Route
                     path='/investigations/create'
                     element={
                        <PrivateRoute>
                           <AddEditInvestigation />
                        </PrivateRoute>
                     }
                  />
                  <Route
                     path='/change-user-role'
                     element={
                        <PrivateRoute>
                           <ChangeUserRole />
                        </PrivateRoute>
                     }
                  />
               </Routes>
            </Container>
         </div>
      </div>
   );
}

export default App;
