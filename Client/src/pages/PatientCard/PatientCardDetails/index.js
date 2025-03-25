import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Paper, Typography, Box, Divider, Grid } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { fetchRemovePatientCard } from '../../../redux/slices/patientCards';
import styles from './PatientCardDetails.module.scss';
import { VaccinationEditDialog } from './EditModals/VaccinationEditDialog';

export const PatientCardDetails = () => {
   const { id } = useParams(); // Получаем ID из URL
   const navigate = useNavigate();
   const dispatch = useDispatch();

   const [patientCard, setPatientCard] = useState(null);
   const [isLoading, setIsLoading] = useState(true);
   const [openVaccinationDialog, setOpenVaccinationDialog] = useState(false);
   const [editVaccination, setEditVaccination] = useState(null);

   useEffect(() => {
      const fetchPatientCard = async () => {
         try {
            const { data } = await axios.get(
               `http://localhost:5000/patient-cards/${id}`,
            );
            setPatientCard(data);
         } catch (err) {
            console.error('Ошибка при загрузке карты пациента:', err);
            alert('Не удалось загрузить данные пациента.');
         } finally {
            setIsLoading(false);
         }
      };

      fetchPatientCard();
   }, [id]);

   const handleDelete = async () => {
      if (
         window.confirm('Вы действительно хотите удалить эту карту пациента?')
      ) {
         try {
            await dispatch(fetchRemovePatientCard(id));
            navigate('/patient-cards');
         } catch (err) {
            console.error('Ошибка при удалении карты пациента:', err);
         }
      }
   };

   const handleEditVaccination = (vaccination) => {
      setEditVaccination(vaccination);
      setOpenVaccinationDialog(true);
   };

   const handleSaveVaccination = async (updatedVaccination) => {
      try {
         const { data } = await axios.patch(
            `http://localhost:5000/vaccinations/${updatedVaccination._id}`,
            updatedVaccination,
         );
         setPatientCard((prev) => ({
            ...prev,
            vaccinationHistory: prev.vaccinationHistory.map((vaccination) =>
               vaccination._id === updatedVaccination._id
                  ? updatedVaccination
                  : vaccination,
            ),
         }));
      } catch (err) {
         console.error('Ошибка при обновлении записи вакцинации:', err);
         alert('Не удалось обновить запись вакцинации');
      }
   };

   if (isLoading) {
      return <div>Загрузка...</div>;
   }

   if (!patientCard) {
      return <div>Карта пациента не найдена</div>;
   }
   return (
      <Paper className={styles.container}>
         <Typography variant='h4' className={styles.title}>
            Карта пациента
         </Typography>
         <Box className={styles.details}>
            <Grid container spacing={2}>
               <Grid item xs={12} sm={6}>
                  <Typography variant='subtitle1'>
                     <strong>ID пациента:</strong> {patientCard.patientId}
                  </Typography>
               </Grid>
               <Grid item xs={12} sm={6}>
                  <Typography variant='subtitle1'>
                     <strong>Пол:</strong>{' '}
                     {patientCard.gender === 'Male' ? 'Мужчина' : 'Женщина'}
                  </Typography>
               </Grid>
               <Grid item xs={12} sm={6}>
                  <Typography variant='subtitle1'>
                     <strong>Дата рождения:</strong>{' '}
                     {new Date(patientCard.dateOfBirth).toLocaleDateString()}
                  </Typography>
               </Grid>
               <Grid item xs={12} sm={6}>
                  <Typography variant='subtitle1'>
                     <strong>Место работы:</strong> {patientCard.workplace}
                  </Typography>
               </Grid>
               <Grid item xs={12}>
                  <Typography variant='subtitle1'>
                     <strong>ФИО:</strong> {patientCard.fullName}
                  </Typography>
               </Grid>
               <Grid item xs={12}>
                  <Typography variant='subtitle1'>
                     <strong>Домашний адрес:</strong> {patientCard.homeAddress}
                  </Typography>
               </Grid>
               <Grid item xs={12}>
                  <Typography variant='subtitle1'>
                     <strong>Паспортные данные:</strong>{' '}
                     {patientCard.passportData}
                  </Typography>
               </Grid>
               <Grid item xs={12}>
                  <Typography variant='subtitle1'>
                     <strong>Медицинское учреждение:</strong>{' '}
                     {patientCard.medicalInstitution}
                  </Typography>
               </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />
            <Typography variant='h6' gutterBottom>
               История болезней
            </Typography>
            {patientCard.diseasesHistory.length > 0 ? (
               patientCard.diseasesHistory.map((disease, index) => (
                  <Box
                     key={index}
                     sx={{ mb: 2, p: 2, borderRadius: 1, bgcolor: '#f5f5f5' }}
                  >
                     <Typography variant='body1'>
                        <strong>Диагноз:</strong>{' '}
                        {disease.diseaseId
                           ? `${disease.diseaseId.diseaseName} (Код: ${disease.diseaseId.diseaseCode})`
                           : 'Не указано'}
                     </Typography>
                     <Typography variant='body2'>
                        <strong>Дата постановки диагноза:</strong>{' '}
                        {new Date(disease.diagnosisDate).toLocaleDateString()}
                     </Typography>
                     {disease.recoveryDate && (
                        <Typography variant='body2'>
                           <strong>Дата выздоровления:</strong>{' '}
                           {new Date(disease.recoveryDate).toLocaleDateString()}
                        </Typography>
                     )}
                     <Typography variant='body2'>
                        <strong>Симптомы:</strong>{' '}
                        {disease.symptoms || 'Не указаны'}
                     </Typography>
                     <Typography variant='body2'>
                        <strong>Лечение:</strong>{' '}
                        {disease.treatment || 'Не указано'}
                     </Typography>
                     <Typography variant='body2'>
                        <strong>Дополнительные заметки:</strong>{' '}
                        {disease.notes || 'Нет'}
                     </Typography>
                  </Box>
               ))
            ) : (
               <Typography variant='body2' color='textSecondary'>
                  История болезней не указана.
               </Typography>
            )}

            {/* История прививок */}
            <Divider sx={{ my: 2 }} />
            <Typography variant='h6' gutterBottom>
               История прививок
            </Typography>
            {patientCard.vaccinationHistory.length > 0 ? (
               patientCard.vaccinationHistory.map((vaccination, index) => (
                  <Box
                     key={index}
                     sx={{ mb: 2, p: 2, borderRadius: 1, bgcolor: '#f5f5f5' }}
                  >
                     <Typography variant='body1'>
                        <strong>Вакцина:</strong>{' '}
                        {vaccination.vaccineId
                           ? vaccination.vaccineId.vaccineName
                           : 'Не указано'}
                     </Typography>
                     <Typography variant='body2'>
                        <strong>Дата вакцинации:</strong>{' '}
                        {new Date(
                           vaccination.vaccinationDate,
                        ).toLocaleDateString()}
                     </Typography>
                     {vaccination.boosterDate && (
                        <Typography variant='body2'>
                           <strong>Дата ревакцинации:</strong>{' '}
                           {new Date(
                              vaccination.boosterDate,
                           ).toLocaleDateString()}
                        </Typography>
                     )}
                     <Typography variant='body1'>
                        <strong>Место вакцинации:</strong>{' '}
                        {vaccination.healthcareProvider
                           ? vaccination.healthcareProvider
                           : 'Не указано'}
                     </Typography>
                     <Button onClick={() => handleEditVaccination(vaccination)}>
                        Редактировать
                     </Button>
                  </Box>
               ))
            ) : (
               <Typography variant='body2' color='textSecondary'>
                  История вакцинаций не указана.
               </Typography>
            )}

            <VaccinationEditDialog
               open={openVaccinationDialog}
               onClose={() => setOpenVaccinationDialog(false)}
               vaccination={editVaccination}
               onSave={handleSaveVaccination}
            />
         </Box>

         <Box className={styles.actions}>
            <Button
               variant='contained'
               color='primary'
               component={Link}
               to={`/patient-cards/${id}/edit`}
               style={{ marginRight: 8 }}
               startIcon={<Edit />}
            >
               Редактировать
            </Button>
         </Box>
      </Paper>
   );
};
