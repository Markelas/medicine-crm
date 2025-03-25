import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
   Button,
   TextField,
   Paper,
   Typography,
   Autocomplete,
   FormControl,
   InputLabel,
   Select,
   MenuItem,
} from '@mui/material';
import styles from './CreateVaccinationRecordPage.module.scss';

export const CreateVaccinationRecordPage = () => {
   const [patientId, setPatientId] = useState('');
   const [vaccineId, setVaccineId] = useState(null);
   const [vaccinationDate, setVaccinationDate] = useState('');
   const [boosterDate, setBoosterDate] = useState('');
   const [healthcareProvider, setHealthcareProvider] = useState('');
   const [patients, setPatients] = useState([]);
   const [vaccines, setVaccines] = useState([]);
   const [isLoading, setIsLoading] = useState(false);
   const [searchQuery, setSearchQuery] = useState('');
   const navigate = useNavigate();

   useEffect(() => {
      const fetchPatients = async () => {
         try {
            const patientResponse = await axios.get(
               'http://localhost:5000/patient-cards',
            );
            setPatients(patientResponse.data);
         } catch (error) {
            console.error('Ошибка при загрузке пациентов:', error);
         }
      };
      fetchPatients();
   }, []);

   const handleSearchVaccines = async (event, newValue) => {
      setSearchQuery(newValue);

      if (newValue.trim() === '') {
         setVaccines([]);
         return;
      }

      setIsLoading(true);

      try {
         const response = await axios.get('http://localhost:5000/vaccines', {
            params: {
               search: newValue,
               noPagination: true,
            },
         });
         setVaccines(response.data.vaccines);
      } catch (error) {
         console.error('Ошибка при загрузке вакцин:', error);
      } finally {
         setIsLoading(false);
      }
   };

   const handleSearchPatients = async (event, newValue) => {
      setSearchQuery(newValue);

      if (newValue.trim() === '') {
         setPatients([]);
         return;
      }

      setIsLoading(true);

      try {
         const response = await axios.get(
            'http://localhost:5000/patient-cards',
            {
               params: { search: newValue },
            },
         );
         setPatients(response.data);
      } catch (error) {
         console.error('Ошибка при загрузке пациентов:', error);
      } finally {
         setIsLoading(false);
      }
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      setIsLoading(true);

      try {
         await axios.post('http://localhost:5000/vaccinations', {
            patientId,
            vaccineId: vaccineId?._id,
            vaccinationDate,
            boosterDate,
            healthcareProvider,
         });

         navigate('/patient-cards');
      } catch (error) {
         console.error('Ошибка при создании записи вакцинации:', error);
         alert('Не удалось создать запись вакцинации');
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <Paper className={styles.container}>
         <Typography variant='h4' gutterBottom>
            Записать вакцинацию
         </Typography>
         <form onSubmit={handleSubmit}>
            <Autocomplete
               id='patient-search'
               options={patients}
               getOptionLabel={(option) =>
                  `${option.fullName} (ID: ${option.patientId})`
               }
               value={patients.find((patient) => patient._id === patientId)}
               onChange={(event, newValue) => setPatientId(newValue?._id || '')}
               onInputChange={handleSearchPatients}
               loading={isLoading}
               renderInput={(params) => (
                  <TextField
                     {...params}
                     label='Поиск пациента'
                     variant='outlined'
                     fullWidth
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     style={{ marginBottom: '20px' }}
                  />
               )}
            />

            <Autocomplete
               id='vaccine-search'
               options={vaccines}
               getOptionLabel={(option) => option.vaccineName}
               value={vaccineId}
               onChange={(event, newValue) => setVaccineId(newValue)}
               onInputChange={handleSearchVaccines}
               loading={isLoading}
               renderInput={(params) => (
                  <TextField
                     {...params}
                     label='Поиск вакцины'
                     variant='outlined'
                     fullWidth
                     style={{ marginBottom: '20px' }}
                  />
               )}
            />

            <TextField
               label='Дата вакцинации'
               variant='outlined'
               type='date'
               fullWidth
               value={vaccinationDate}
               onChange={(e) => setVaccinationDate(e.target.value)}
               required
               style={{ marginBottom: '20px' }}
               InputLabelProps={{
                  shrink: true,
               }}
            />

            <TextField
               label='Дата ревакцинации (если есть)'
               variant='outlined'
               type='date'
               fullWidth
               value={boosterDate}
               onChange={(e) => setBoosterDate(e.target.value)}
               style={{ marginBottom: '20px' }}
               InputLabelProps={{
                  shrink: true,
               }}
            />

            <TextField
               label='Медицинское учреждение'
               variant='outlined'
               fullWidth
               value={healthcareProvider}
               onChange={(e) => setHealthcareProvider(e.target.value)}
               style={{ marginBottom: '20px' }}
            />

            <div className={styles.actions}>
               <Button
                  variant='contained'
                  color='primary'
                  type='submit'
                  disabled={isLoading}
               >
                  {isLoading ? 'Создание...' : 'Создать запись'}
               </Button>
               <Button
                  variant='outlined'
                  color='secondary'
                  onClick={() => navigate('/vaccinationRecords')}
                  style={{ marginLeft: '10px' }}
               >
                  Отмена
               </Button>
            </div>
         </form>
      </Paper>
   );
};
