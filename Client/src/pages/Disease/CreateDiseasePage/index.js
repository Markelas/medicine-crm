import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
   Button,
   TextField,
   Paper,
   Typography,
   Switch,
   FormControlLabel,
} from '@mui/material';
import styles from './CreateDiseasePage.module.scss';

export const CreateDiseasePage = () => {
   const [diseaseCode, setDiseaseCode] = useState('');
   const [diseaseName, setDiseaseName] = useState('');
   const [epidThreshold, setEpidThreshold] = useState('');
   const [isEmergency, setIsEmergency] = useState(false);
   const [isLoading, setIsLoading] = useState(false);
   const navigate = useNavigate();

   const handleSubmit = async (e) => {
      e.preventDefault();

      if (epidThreshold.trim() === '' || isNaN(epidThreshold)) {
         alert(
            'Порог случаев (эпидемиологический) должен быть числом и не может быть пустым',
         );
         return;
      }

      setIsLoading(true);

      try {
         await axios.post('http://localhost:5000/diseases', {
            diseaseCode,
            diseaseName,
            epidThreshold: parseFloat(epidThreshold),
            isEmergency,
         });

         navigate('/diseases');
      } catch (error) {
         console.error('Ошибка при создании заболевания:', error);
         alert('Не удалось создать заболевание');
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <Paper className={styles.container}>
         <Typography variant='h4' gutterBottom>
            Добавить заболевание
         </Typography>
         <form onSubmit={handleSubmit}>
            <TextField
               label='Код болезни (МКБ10)'
               variant='outlined'
               fullWidth
               value={diseaseCode}
               onChange={(e) => setDiseaseCode(e.target.value)}
               required
               style={{ marginBottom: '20px' }}
            />
            <TextField
               label='Название болезни'
               variant='outlined'
               fullWidth
               value={diseaseName}
               onChange={(e) => setDiseaseName(e.target.value)}
               required
               style={{ marginBottom: '20px' }}
            />
            <TextField
               label='Порог случаев (эпидемиологический)'
               variant='outlined'
               fullWidth
               value={epidThreshold}
               onChange={(e) => setEpidThreshold(e.target.value)}
               required
               style={{ marginBottom: '20px' }}
               type='number'
            />
            <FormControlLabel
               control={
                  <Switch
                     checked={isEmergency}
                     onChange={(e) => setIsEmergency(e.target.checked)}
                     color='primary'
                  />
               }
               label='Опасная болезнь'
               style={{ marginBottom: '20px' }}
            />
            <div className={styles.actions}>
               <Button
                  variant='contained'
                  color='primary'
                  type='submit'
                  disabled={isLoading}
               >
                  {isLoading ? 'Создание...' : 'Создать заболевание'}
               </Button>
               <Button
                  variant='outlined'
                  color='secondary'
                  onClick={() => navigate('/diseases')}
                  style={{ marginLeft: '10px' }}
               >
                  Отмена
               </Button>
            </div>
         </form>
      </Paper>
   );
};
