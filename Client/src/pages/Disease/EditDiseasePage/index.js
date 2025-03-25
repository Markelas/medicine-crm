import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import {
   Button,
   TextField,
   Paper,
   Typography,
   Switch,
   FormControlLabel,
} from '@mui/material';
import styles from './EditDiseasePage.module.scss';

export const EditDiseasePage = () => {
   const { code } = useParams(); // Получаем код заболевания из параметров URL
   const navigate = useNavigate();

   const [diseaseCode, setDiseaseCode] = useState('');
   const [diseaseName, setDiseaseName] = useState('');
   const [epidThreshold, setEpidThreshold] = useState('');
   const [isEmergency, setIsEmergency] = useState(false); // Новое состояние для опасной болезни
   const [isLoading, setIsLoading] = useState(false);
   console.log('code', code);

   useEffect(() => {
      const fetchDisease = async () => {
         try {
            const { data } = await axios.get(
               `http://localhost:5000/diseases/${code}`,
            );
            setDiseaseCode(data.diseaseCode);
            setDiseaseName(data.diseaseName);
            setEpidThreshold(data.epidThreshold); // Устанавливаем порог случаев
            setIsEmergency(data.isEmergency); // Устанавливаем флаг опасной болезни
         } catch (error) {
            console.error('Ошибка при загрузке заболевания:', error);
            alert('Не удалось загрузить заболевание');
         }
      };

      fetchDisease();
   }, [code]);

   const handleSubmit = async (e) => {
      e.preventDefault();
      setIsLoading(true);

      try {
         await axios.patch(`http://localhost:5000/diseases/${diseaseCode}`, {
            diseaseCode,
            diseaseName,
            epidThreshold,
            isEmergency,
         });

         // После успешного редактирования перенаправляем на список заболеваний
         navigate('/diseases');
      } catch (error) {
         console.error('Ошибка при редактировании заболевания:', error);
         alert('Не удалось обновить заболевание');
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <Paper className={styles.container}>
         <Typography variant='h4' gutterBottom>
            Редактировать заболевание
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
               disabled
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
                  {isLoading ? 'Редактирование...' : 'Сохранить изменения'}
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
