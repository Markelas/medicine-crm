import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Paper, Typography } from '@mui/material';
import axios from 'axios';
import styles from './EmergencyNotificationDetails.module.scss';
import { useSelector } from 'react-redux';
import { selectIsAdmin } from '../../../redux/slices/auth';

export const EmergencyNotificationDetails = () => {
   const { id } = useParams(); // Получаем ID извещения из URL
   const navigate = useNavigate();
   const isAdmin = useSelector(selectIsAdmin);

   const [notification, setNotification] = useState(null);
   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
      const fetchNotification = async () => {
         console.log('id', id);
         try {
            const { data } = await axios.get(
               `http://localhost:5000/notifications/${id}`,
            );
            setNotification(data);
         } catch (err) {
            console.error('Ошибка при загрузке извещения:', err);
            alert('Не удалось загрузить данные извещения.');
         } finally {
            setIsLoading(false);
         }
      };

      fetchNotification();
   }, [id]);

   const handleDelete = async () => {
      if (
         window.confirm(
            'Вы действительно хотите удалить это экстренное извещение?',
         )
      ) {
         try {
            await axios.delete(`http://localhost:5000/notifications/${id}`);
            navigate('/notifications');
         } catch (err) {
            console.error('Ошибка при удалении извещения:', err);
         }
      }
   };

   if (isLoading) {
      return <div>Загрузка...</div>;
   }

   if (!notification) {
      return <div>Извещение не найдено</div>;
   }

   return (
      <Paper className={styles.container}>
         <Typography variant='h4' className={styles.title}>
            Детали экстренного извещения
         </Typography>

         <div className={styles.details}>
            <Typography variant='h6' className={styles.sectionTitle}>
               Основные данные
            </Typography>
            <Typography>
               <strong>ID извещения:</strong> {notification.notificationId}
            </Typography>
            <Typography>
               <strong>Дата извещения:</strong>{' '}
               {new Date(notification.notificationDate).toLocaleDateString()}
            </Typography>
            <Typography>
               <strong>Пациент:</strong>{' '}
               {notification.patientId
                  ? notification.patientId.fullName
                  : 'Не указан'}
            </Typography>
            <Typography>
               <strong>Дата рождения пациента:</strong>{' '}
               {new Date(
                  notification.patientId.dateOfBirth,
               ).toLocaleDateString()}
            </Typography>
            <Typography>
               <strong>Пол пациента:</strong>{' '}
               {notification.patientId.gender === 'Male'
                  ? 'Мужчина'
                  : 'Женщина'}
            </Typography>
            <Typography>
               <strong>Место проживания:</strong> {notification.residence}
            </Typography>
            <Typography>
               <strong>Медицинское учреждение:</strong>{' '}
               {notification.medicalInstitution}
            </Typography>
         </div>

         <div className={styles.diseaseDetails}>
            <Typography variant='h6' className={styles.sectionTitle}>
               Детали зарегистрированного заболевания
            </Typography>
            {notification.diseaseDetails ? (
               <>
                  <Typography>
                     <strong>Код заболевания:</strong>{' '}
                     {notification.diseaseDetails.diseaseCode}
                  </Typography>
                  <Typography>
                     <strong>Название заболевания:</strong>{' '}
                     {notification.diseaseDetails.diseaseName}
                  </Typography>
               </>
            ) : (
               <Typography>Детали заболевания не найдены</Typography>
            )}
         </div>

         <div className={styles.details}>
            <Typography variant='h6' className={styles.sectionTitle}>
               История болезней
            </Typography>
            {notification.patientId.diseasesHistory &&
            notification.patientId.diseasesHistory.length > 0 ? (
               notification.patientId.diseasesHistory.map((disease) => (
                  <div key={disease._id}>
                     <Typography>
                        <strong>Болезнь:</strong>{' '}
                        {disease.diseaseName
                           ? `(${disease.diseaseCode}) ${disease.diseaseName}`
                           : 'Не указано'}
                     </Typography>
                     <Typography>
                        <strong>Дата диагноза:</strong>{' '}
                        {new Date(disease.diagnosisDate).toLocaleDateString()}
                     </Typography>
                     {disease.recoveryDate && (
                        <Typography>
                           <strong>Дата выздоровления:</strong>{' '}
                           {new Date(disease.recoveryDate).toLocaleDateString()}
                        </Typography>
                     )}
                     <Typography>
                        <strong>Симптомы:</strong> {disease.symptoms}
                     </Typography>
                     <Typography>
                        <strong>Лечение:</strong> {disease.treatment}
                     </Typography>
                     {disease.notes && (
                        <Typography>
                           <strong>Примечания:</strong> {disease.notes}
                        </Typography>
                     )}
                     <hr />
                  </div>
               ))
            ) : (
               <Typography>История болезней не найдена</Typography>
            )}
         </div>

         <div className={styles.details}>
            <Typography variant='h6' className={styles.sectionTitle}>
               История вакцинаций
            </Typography>
            {notification.vaccinationHistory &&
            notification.vaccinationHistory.length > 0 ? (
               notification.vaccinationHistory.map((record) => (
                  <div key={record.vaccineName}>
                     <Typography>
                        <strong>Вакцина:</strong> {record.vaccineName}
                     </Typography>
                     <Typography>
                        <strong>Дата вакцинации:</strong>{' '}
                        {new Date(record.vaccinationDate).toLocaleDateString()}
                     </Typography>
                     {record.boosterDate && (
                        <Typography>
                           <strong>Дата ревакцинации:</strong>{' '}
                           {new Date(record.boosterDate).toLocaleDateString()}
                        </Typography>
                     )}
                     <Typography>
                        <strong>Медицинское учреждение:</strong>{' '}
                        {record.healthcareProvider}
                     </Typography>
                     <hr />
                  </div>
               ))
            ) : (
               <Typography>Вакцинации не найдены</Typography>
            )}
         </div>

         <div className={styles.actions}>
            {isAdmin && (
               <Button variant='contained' color='error' onClick={handleDelete}>
                  Удалить
               </Button>
            )}
         </div>
      </Paper>
   );
};
