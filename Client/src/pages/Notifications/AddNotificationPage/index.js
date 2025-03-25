import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
   Button,
   TextField,
   Paper,
   Typography,
   MenuItem,
   Select,
   InputLabel,
   FormControl,
} from '@mui/material';
import axios from 'axios';
import { TOKEN } from '../../../consts';
import styles from './AddNotificationPage.module.scss';

export const AddNotificationPage = () => {
   const navigate = useNavigate();
   const [isLoading, setIsLoading] = useState(false);

   const [notificationId, setNotificationId] = useState('');
   const [notificationDate, setNotificationDate] = useState('');
   const [patientId, setPatientId] = useState('');
   const [diseaseCode, setDiseaseCode] = useState('');
   const [residence, setResidence] = useState('');
   const [medicalInstitution, setMedicalInstitution] = useState('');

   const [patients, setPatients] = useState([]);

   useEffect(() => {
      const fetchPatients = async () => {
         try {
            const { data } = await axios.get(
               'http://localhost:5000/patient-cards',
               {
                  headers: { Authorization: TOKEN },
               },
            );
            setPatients(data);
         } catch (err) {
            console.error('Ошибка при загрузке списка пациентов:', err);
            alert('Не удалось загрузить список пациентов.');
         }
      };

      fetchPatients();
   }, []);

   const handlePatientChange = (selectedPatientId) => {
      setPatientId(selectedPatientId);

      const selectedPatient = patients.find(
         (patient) => patient._id === selectedPatientId,
      );
      if (selectedPatient) {
         setResidence(selectedPatient.homeAddress || '');
         setMedicalInstitution(selectedPatient.medicalInstitution || '');
      }
   };

   const onSubmit = async () => {
      try {
         setIsLoading(true);
         console.log('patientId', patientId);
         const fields = {
            notificationId,
            notificationDate,
            patientId,
            diseaseCode,
            residence,
            medicalInstitution,
         };

         await axios.post('http://localhost:5000/notifications', fields, {
            headers: { Authorization: TOKEN },
         });

         navigate('/notifications');
      } catch (err) {
         console.error(err);
         alert('Ошибка при создании извещения');
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <Paper style={{ padding: 30 }}>
         <Typography variant='h4' className={styles.title}>
            Добавить экстренное извещение
         </Typography>
         <TextField
            label='ID извещения'
            value={notificationId}
            onChange={(e) => setNotificationId(e.target.value)}
            variant='outlined'
            fullWidth
            margin='normal'
         />
         <TextField
            label='Дата извещения'
            type='date'
            value={notificationDate}
            onChange={(e) => setNotificationDate(e.target.value)}
            variant='outlined'
            fullWidth
            margin='normal'
            InputLabelProps={{
               shrink: true,
            }}
         />

         <FormControl fullWidth margin='normal'>
            <InputLabel>Выберите пациента</InputLabel>
            <Select
               value={patientId}
               onChange={(e) => handlePatientChange(e.target.value)}
               label='Выберите пациента'
            >
               {patients.map((patient) => (
                  <MenuItem key={patient._id} value={patient._id}>
                     {patient.fullName}
                  </MenuItem>
               ))}
            </Select>
         </FormControl>

         <TextField
            label='Код болезни'
            value={diseaseCode}
            onChange={(e) => setDiseaseCode(e.target.value)}
            variant='outlined'
            fullWidth
            margin='normal'
         />
         <TextField
            label='Место проживания'
            value={residence}
            onChange={(e) => setResidence(e.target.value)}
            variant='outlined'
            fullWidth
            margin='normal'
         />
         <TextField
            label='Медицинское учреждение'
            value={medicalInstitution}
            onChange={(e) => setMedicalInstitution(e.target.value)}
            variant='outlined'
            fullWidth
            margin='normal'
         />
         <div className={styles.buttons}>
            <Button
               onClick={onSubmit}
               size='large'
               variant='contained'
               disabled={isLoading}
            >
               {isLoading ? 'Создание...' : 'Создать извещение'}
            </Button>
            <Button
               size='large'
               variant='outlined'
               onClick={() => navigate('/notifications')}
            >
               Отмена
            </Button>
         </div>
      </Paper>
   );
};
