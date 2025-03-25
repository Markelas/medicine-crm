import React, { useEffect, useState } from 'react';
import {
   Button,
   Paper,
   Typography,
   TextField,
   ListItem,
   List,
} from '@mui/material';
import axios from 'axios';
import styles from './InvestigationDetails.module.scss';
import { useParams } from 'react-router-dom';

export const InvestigationDetails = () => {
   const { id } = useParams();
   const [investigation, setInvestigation] = useState(null);
   const [patients, setPatients] = useState([]);
   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
      const fetchInvestigation = async () => {
         try {
            const { data } = await axios.get(
               `http://localhost:5000/investigations/${id}`,
            );
            setInvestigation(data);
         } catch (err) {
            console.error('Ошибка при загрузке расследования:', err);
            alert('Не удалось загрузить данные расследования.');
         } finally {
            setIsLoading(false);
         }
      };

      const fetchPatients = async () => {
         if (investigation?.diseaseCode?.diseaseCode) {
            try {
               const { data } = await axios.get(
                  `http://localhost:5000/investigations/disease/${investigation.diseaseCode.diseaseCode}/patients/last-month`,
               );
               setPatients(data);
            } catch (err) {
               console.error('Ошибка при загрузке пациентов:', err);
            }
         }
      };

      fetchInvestigation();
      fetchPatients();
   }, [id, investigation?.diseaseCode?.diseaseCode]);

   const handleSave = async () => {
      try {
         await axios.patch(`http://localhost:5000/investigations/${id}`, {
            contactCircle: investigation.contactCircle,
            placeOfOccurrence: investigation.placeOfOccurrence,
            sourceOfInfection: investigation.sourceOfInfection,
            infectionRisks: investigation.infectionRisks,
            laboratoryResearch: investigation.laboratoryResearch,
         });
         alert('Данные успешно обновлены!');
      } catch (err) {
         console.error('Ошибка при сохранении данных:', err);
         alert('Ошибка при сохранении.');
      }
   };

   if (isLoading) {
      return <div>Загрузка...</div>;
   }

   if (!investigation) {
      return <div>Расследование не найдено</div>;
   }

   // Форматирование даты
   const createdAt = new Date(investigation?.createdAt);
   const formattedDate = createdAt.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
   });

   return (
      <Paper className={styles.container}>
         <Typography variant='h4' className={styles.title}>
            Детали расследования
         </Typography>
         <div className={styles.details}>
            <Typography>
               <strong>ID расследования:</strong>{' '}
               {investigation?.investigationId}
            </Typography>
            <Typography>
               <strong>ID извещения:</strong>{' '}
               {investigation?.notificationId?.notificationId}
            </Typography>
            <Typography>
               <strong>ФИО пациента:</strong>{' '}
               {investigation?.patientDetails?.fullName || 'Неизвестно'}
            </Typography>
            <Typography>
               <strong>Пол пациента:</strong>{' '}
               {investigation?.patientDetails?.gender || 'Неизвестно'}
            </Typography>
            <Typography>
               <strong>Место работы:</strong>{' '}
               {investigation?.patientDetails?.workplace || 'Неизвестно'}
            </Typography>
            <Typography>
               <strong>Место жительства:</strong>{' '}
               {investigation?.patientDetails?.homeAddress || 'Неизвестно'}
            </Typography>
            <Typography>
               <strong>Код болезни:</strong>{' '}
               {investigation?.diseaseCode?.diseaseCode || 'Неизвестно'}
            </Typography>
            <Typography>
               <strong>Название болезни:</strong>{' '}
               {investigation?.diseaseCode?.diseaseName || 'Неизвестно'}
            </Typography>
            <Typography>
               <strong>Дата создания расследования:</strong>{' '}
               {formattedDate || 'Неизвестно'}
            </Typography>
            <Typography variant='h6'>
               Пациенты с данной болезнью за последний месяц:
            </Typography>
            <List>
               {patients.length > 0 ? (
                  patients.map((patient, index) => (
                     <ListItem key={index}>{patient.fullName}</ListItem>
                  ))
               ) : (
                  <Typography>Нет пациентов за последний месяц</Typography>
               )}
            </List>
         </div>
         <div>
            <TextField
               label='Лабораторные исследования'
               fullWidth
               value={investigation.laboratoryResearch || ''}
               onChange={(e) =>
                  setInvestigation({
                     ...investigation,
                     laboratoryResearch: e.target.value,
                  })
               }
               margin='normal'
            />
            <TextField
               label='Круг контактных лиц'
               fullWidth
               value={investigation.contactCircle || ''}
               onChange={(e) =>
                  setInvestigation({
                     ...investigation,
                     contactCircle: e.target.value,
                  })
               }
               margin='normal'
            />
            <TextField
               label='Место возникновения заболевания'
               fullWidth
               value={investigation.placeOfOccurrence || ''}
               onChange={(e) =>
                  setInvestigation({
                     ...investigation,
                     placeOfOccurrence: e.target.value,
                  })
               }
               margin='normal'
            />
            <TextField
               label='Источник заражения'
               fullWidth
               value={investigation.sourceOfInfection || ''}
               onChange={(e) =>
                  setInvestigation({
                     ...investigation,
                     sourceOfInfection: e.target.value,
                  })
               }
               margin='normal'
            />
            <TextField
               label='Риски и пути распространения инфекции'
               fullWidth
               value={investigation.infectionRisks || ''}
               onChange={(e) =>
                  setInvestigation({
                     ...investigation,
                     infectionRisks: e.target.value,
                  })
               }
               margin='normal'
            />
         </div>
         <div className={styles.actions}>
            <Button variant='contained' color='primary' onClick={handleSave}>
               Сохранить
            </Button>
         </div>
      </Paper>
   );
};
