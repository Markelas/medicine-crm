import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableRow,
   Paper,
   TextField,
   Button,
} from '@mui/material';
import { Visibility, Edit, Delete } from '@mui/icons-material';
import styles from './PatientCardsPage.module.scss';
import {
   fetchPatientCards,
   fetchRemovePatientCard,
} from '../../../redux/slices/patientCards';
import { selectIsAdmin } from '../../../redux/slices/auth';

export const PatientCardsPage = () => {
   const dispatch = useDispatch();
   const { patientCards } = useSelector((state) => state.patientCards);
   const isAdmin = useSelector(selectIsAdmin);

   // Стейт для поиска
   const [searchQuery, setSearchQuery] = useState('');

   useEffect(() => {
      dispatch(fetchPatientCards(searchQuery)); // Передаем запрос поиска
   }, [dispatch, searchQuery]); // Зависят от searchQuery, обновляем при изменении

   const handleDelete = async (id) => {
      if (
         window.confirm('Вы действительно хотите удалить эту карту пациента?')
      ) {
         dispatch(fetchRemovePatientCard(id));
      }
   };

   // Обработчик изменения в поле поиска
   const handleSearchChange = (event) => {
      setSearchQuery(event.target.value); // Обновляем стейт при изменении значения в поле поиска
   };

   return (
      <div className={styles.container}>
         <div className={styles.header}>
            <h1>Карты пациентов</h1>

            <div className={styles.searchContainer}>
               <TextField
                  label='Поиск по имени и фамилии'
                  variant='outlined'
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className={styles.searchInput}
               />
               <Button
                  className={styles.buttonAddPatient}
                  component={Link}
                  to='/patient-cards/create'
               >
                  Добавить карту пациента
               </Button>
            </div>
         </div>

         <Paper className={styles.tableContainer}>
            <Table>
               <TableHead>
                  <TableRow className={styles.tableHeader}>
                     <TableCell>ID пациента</TableCell>
                     <TableCell>ФИО</TableCell>
                     <TableCell>Пол</TableCell>
                     <TableCell>Дата рождения</TableCell>
                     <TableCell>Место работы</TableCell>
                     <TableCell>Домашний адрес</TableCell>
                     <TableCell>Паспортные данные</TableCell>
                     <TableCell>Медицинское учреждение</TableCell>
                     <TableCell align='center' className={styles.actionColumn}>
                        Действия
                     </TableCell>
                  </TableRow>
               </TableHead>
               <TableBody>
                  {patientCards.items.map((card) => (
                     <TableRow key={card._id} className={styles.tableRow}>
                        <TableCell>{card.patientId}</TableCell>
                        <TableCell>{card.fullName}</TableCell>
                        <TableCell>
                           {card.gender === 'Male' ? 'Мужчина' : 'Женщина'}
                        </TableCell>
                        <TableCell>
                           {new Date(card.dateOfBirth).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{card.workplace}</TableCell>
                        <TableCell>{card.homeAddress}</TableCell>
                        <TableCell>{card.passportData}</TableCell>
                        <TableCell>{card.medicalInstitution}</TableCell>
                        <TableCell align='center' className={styles.actionCell}>
                           <Button
                              component={Link}
                              to={`/patient-cards/${card._id}`}
                              className={styles.iconButton}
                           >
                              <Visibility />
                           </Button>
                           <Button
                              component={Link}
                              to={`/patient-cards/${card._id}/edit`}
                              className={styles.iconButton}
                           >
                              <Edit />
                           </Button>
                           {isAdmin && (
                              <Button
                                 onClick={() => handleDelete(card._id)}
                                 className={styles.iconButton}
                              >
                                 <Delete />
                              </Button>
                           )}
                        </TableCell>
                     </TableRow>
                  ))}
               </TableBody>
            </Table>
         </Paper>
      </div>
   );
};
