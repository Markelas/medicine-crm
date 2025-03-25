import React, { useState, useEffect } from 'react';
import {
   TextField,
   Button,
   Typography,
   Container,
   Autocomplete,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
   fetchPatients,
   fetchDiseases,
   createPatientVisit,
} from '../../../redux/slices/patientVisits';
import { useNavigate } from 'react-router-dom';

const PatientVisitForm = () => {
   const dispatch = useDispatch();
   const navigate = useNavigate();

   const { patients, diseases } = useSelector((state) => state.patientVisits);
   const [selectedPatient, setSelectedPatient] = useState(null);
   const [formData, setFormData] = useState({
      diseaseId: null,
      diagnosisDate: '',
      recoveryDate: '',
      symptoms: '',
      treatment: '',
      notes: '',
   });

   useEffect(() => {
      dispatch(fetchPatients());
      dispatch(fetchDiseases());
   }, [dispatch]);

   const handleSearchPatients = async (event, newValue) => {
      dispatch(fetchPatients(newValue));
   };

   const handleSearchDiseases = async (event, newValue) => {
      dispatch(fetchDiseases({ search: newValue }));
   };

   const handleChange = (event) => {
      setFormData({
         ...formData,
         [event.target.name]: event.target.value,
      });
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      if (!selectedPatient) {
         alert('Выберите пациента!');
         return;
      }

      await dispatch(
         createPatientVisit({
            patientId: selectedPatient._id,
            visitData: {
               ...formData,
               diseaseId: formData.diseaseId?._id,
            },
         }),
      );
      navigate(`/patient-cards/${selectedPatient._id}`);
   };

   return (
      <Container maxWidth='sm'>
         <Typography variant='h5' gutterBottom>
            Регистрация визита пациента
         </Typography>
         <form onSubmit={handleSubmit}>
            <Autocomplete
               id='patient-search'
               options={patients.items}
               getOptionLabel={(option) =>
                  `${option.fullName} (ID: ${option.patientId})`
               }
               value={selectedPatient}
               onChange={(event, newValue) => setSelectedPatient(newValue)}
               onInputChange={handleSearchPatients}
               loading={patients.status === 'loading'}
               style={{ marginBottom: '20px' }}
               renderInput={(params) => (
                  <TextField
                     {...params}
                     label='Поиск пациента'
                     variant='outlined'
                     fullWidth
                  />
               )}
            />

            <Autocomplete
               id='disease-search'
               options={diseases.items || []}
               getOptionLabel={(option) => option.diseaseName}
               value={formData.diseaseId}
               onChange={(event, newValue) =>
                  setFormData({ ...formData, diseaseId: newValue })
               }
               onInputChange={handleSearchDiseases}
               loading={diseases.status === 'loading'}
               style={{ marginBottom: '20px' }}
               renderInput={(params) => (
                  <TextField
                     {...params}
                     label='Поиск заболевания'
                     variant='outlined'
                     fullWidth
                  />
               )}
            />

            <TextField
               label='Дата диагноза'
               type='date'
               name='diagnosisDate'
               value={formData.diagnosisDate}
               onChange={handleChange}
               fullWidth
               InputLabelProps={{ shrink: true }}
               style={{ marginBottom: '20px' }}
            />

            <TextField
               label='Дата выздоровления'
               type='date'
               name='recoveryDate'
               value={formData.recoveryDate}
               onChange={handleChange}
               fullWidth
               InputLabelProps={{ shrink: true }}
               style={{ marginBottom: '20px' }}
            />

            <TextField
               label='Симптомы'
               name='symptoms'
               value={formData.symptoms}
               onChange={handleChange}
               fullWidth
               multiline
               rows={3}
               style={{ marginBottom: '20px' }}
            />

            <TextField
               label='Лечение'
               name='treatment'
               value={formData.treatment}
               onChange={handleChange}
               fullWidth
               multiline
               rows={3}
               style={{ marginBottom: '20px' }}
            />

            <TextField
               label='Заметки'
               name='notes'
               value={formData.notes}
               onChange={handleChange}
               fullWidth
               multiline
               rows={3}
               style={{ marginBottom: '20px' }}
            />

            <Button type='submit' variant='contained' color='primary' fullWidth>
               Добавить запись в карточку пациента
            </Button>
         </form>
      </Container>
   );
};

export default PatientVisitForm;
