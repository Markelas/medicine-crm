import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import styles from './AddEditInvestigation.module.scss';

export const AddEditInvestigation = () => {
   const { id } = useParams();
   const navigate = useNavigate();
   const [isLoading, setIsLoading] = useState(false);

   const [investigationId, setInvestigationId] = useState('');
   const [notificationId, setNotificationId] = useState('');
   const [patientCardId, setPatientCardId] = useState('');
   const [diseaseCode, setDiseaseCode] = useState('');
   const [casesRegistered, setCasesRegistered] = useState('');
   const [laboratoryResearch, setLaboratoryResearch] = useState('');

   const isEditing = !!id;

   const onSubmit = async () => {
      try {
         setIsLoading(true);

         const fields = {
            investigationId,
            notificationId,
            patientCardId,
            diseaseCode,
            casesRegistered,
            laboratoryResearch,
         };

         const { data } = isEditing
            ? await axios.patch(
                 `http://localhost:5000/investigations/${id}`,
                 fields,
              )
            : await axios.post('http://localhost:5000/investigations', fields);

         navigate(`/investigations/${data._id}`);
      } catch (err) {
         console.error(err);
         alert('Ошибка при сохранении расследования');
      } finally {
         setIsLoading(false);
      }
   };

   useEffect(() => {
      if (id) {
         axios
            .get(`http://localhost:5000/investigations/${id}`)
            .then(({ data }) => {
               setInvestigationId(data.investigationId);
               setNotificationId(data.notificationId);
               setPatientCardId(data.patientCardId);
               setDiseaseCode(data.diseaseCode);
               setCasesRegistered(data.casesRegistered);
               setLaboratoryResearch(data.laboratoryResearch);
            })
            .catch((err) => {
               console.error('Ошибка при загрузке расследования:', err);
               alert('Не удалось загрузить расследование.');
            });
      }
   }, [id]);

   return (
      <Paper style={{ padding: 30 }}>
         <TextField
            label='ID расследования'
            value={investigationId}
            onChange={(e) => setInvestigationId(e.target.value)}
            variant='outlined'
            fullWidth
            margin='normal'
         />
         <TextField
            label='ID извещения'
            value={notificationId}
            onChange={(e) => setNotificationId(e.target.value)}
            variant='outlined'
            fullWidth
            margin='normal'
         />
         <TextField
            label='ID карты пациента'
            value={patientCardId}
            onChange={(e) => setPatientCardId(e.target.value)}
            variant='outlined'
            fullWidth
            margin='normal'
         />
         <TextField
            label='Код болезни'
            value={diseaseCode}
            onChange={(e) => setDiseaseCode(e.target.value)}
            variant='outlined'
            fullWidth
            margin='normal'
         />
         <TextField
            label='Зарегистрировано случаев'
            value={casesRegistered}
            onChange={(e) => setCasesRegistered(e.target.value)}
            variant='outlined'
            fullWidth
            margin='normal'
         />
         <TextField
            label='Лабораторные исследования'
            value={laboratoryResearch}
            onChange={(e) => setLaboratoryResearch(e.target.value)}
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
               {isEditing ? 'Сохранить' : 'Создать'}
            </Button>
            <Link to='/investigations'>
               <Button size='large'>Отмена</Button>
            </Link>
         </div>
      </Paper>
   );
};
