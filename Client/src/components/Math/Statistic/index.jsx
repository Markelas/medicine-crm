import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Grid } from '@mui/material';
import styles from './Statistic.module.scss';

export const Statistic = () => {
   const [stats, setStats] = useState(null);

   useEffect(() => {
      const fetchStats = async () => {
         try {
            const { data } = await axios.get('http://localhost:5000/general');
            setStats(data);
         } catch (error) {
            console.error('Ошибка загрузки статистики:', error);
         }
      };
      fetchStats();
   }, []);

   if (!stats) return <p>Загрузка статистики...</p>;

   const vaccinationRate = (
      (stats.totalVaccinations / stats.totalPatients) *
      100
   ).toFixed(2);

   // Теперь показываем среднее количество заболеваний на пациента
   const avgDiseasesPerPatient = stats.avgDiseasesPerPatient;
   const avgEmergencyNotificationsPerPatient =
      stats.avgEmergencyNotificationsPerPatient;

   const infectionRate = (
      stats.totalDiseases / stats.totalEmergencyNotifications
   ).toFixed(2);

   return (
      <Grid container spacing={3} sx={{ padding: 3 }}>
         <Grid item xs={10} sm={4}>
            <Card
               sx={{
                  backgroundColor: '#3761f3', // Синий фон
                  borderRadius: '16px', // Закругленные углы
                  boxShadow: 3, // Легкая тень
                  padding: 2,
                  color: 'white', // Белый текст
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  textAlign: 'center',
               }}
            >
               <CardContent>
                  <Typography variant='h8'>
                     Среднее кол-во экстренных уведомлений на пациента
                  </Typography>
                  <Typography variant='h4'>
                     {avgEmergencyNotificationsPerPatient}
                  </Typography>
               </CardContent>
            </Card>
         </Grid>
         <Grid item xs={10} sm={4}>
            <Card
               sx={{
                  backgroundColor: '#3761f3', // Синий фон
                  borderRadius: '16px', // Закругленные углы
                  boxShadow: 3, // Легкая тень
                  padding: 3,
                  color: 'white', // Белый текст
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  textAlign: 'center',
               }}
            >
               <CardContent>
                  <Typography variant='h6'>Процент вакцинированных</Typography>
                  <Typography variant='h4'>{vaccinationRate}%</Typography>
               </CardContent>
            </Card>
         </Grid>
         <Grid item xs={12} sm={4}>
            <Card
               sx={{
                  backgroundColor: '#3761f3', // Синий фон
                  borderRadius: '16px', // Закругленные углы
                  boxShadow: 3, // Легкая тень
                  padding: 3,
                  color: 'white', // Белый текст
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  textAlign: 'center',
               }}
            >
               <CardContent>
                  <Typography variant='h6'>
                     Коэффициент распространения
                  </Typography>
                  <Typography variant='h4'>{infectionRate}</Typography>
               </CardContent>
            </Card>
         </Grid>
      </Grid>
   );
};
