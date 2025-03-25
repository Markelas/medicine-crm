import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
   Button,
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableRow,
   Paper,
} from '@mui/material';
import {
   fetchNotifications,
   fetchRemoveNotification,
} from '../../../redux/slices/notifications';
import styles from './NotificationsPage.module.scss';
import { Delete, Edit, Visibility } from '@mui/icons-material';
import { selectIsAdmin } from '../../../redux/slices/auth';

export const NotificationsPage = () => {
   const dispatch = useDispatch();
   const { notifications } = useSelector((state) => state.notifications);
   const isAdmin = useSelector(selectIsAdmin);

   useEffect(() => {
      dispatch(fetchNotifications());
   }, [dispatch]);

   const handleDelete = async (id) => {
      if (window.confirm('Вы действительно хотите удалить это извещение?')) {
         dispatch(fetchRemoveNotification(id));
      }
   };

   if (notifications.status === 'loading') {
      return <div>Загрузка...</div>;
   }

   if (notifications.status === 'error') {
      return <div>Произошла ошибка при загрузке данных</div>;
   }

   return (
      <div className={styles.container}>
         <div className={styles.header}>
            <h1>Экстренные извещения</h1>
            <Button
               variant='contained'
               color='primary'
               component={Link}
               to='/notifications/create'
               className={styles.buttonAddNotification}
            >
               Добавить извещение
            </Button>
         </div>
         <Paper className={styles.tableContainer}>
            <Table>
               <TableHead>
                  <TableRow className={styles.tableHeader}>
                     <TableCell>ID извещения</TableCell>
                     <TableCell>Дата</TableCell>
                     <TableCell>Пациент</TableCell>
                     <TableCell>Код болезни</TableCell>
                     <TableCell>Место проживания</TableCell>
                     <TableCell>Медицинское учреждение</TableCell>
                     <TableCell align='center'>Действия</TableCell>
                  </TableRow>
               </TableHead>
               <TableBody>
                  {notifications.items.map((notification) => (
                     <TableRow
                        key={notification._id}
                        className={styles.tableRow}
                     >
                        <TableCell>{notification.notificationId}</TableCell>
                        <TableCell>
                           {new Date(
                              notification.notificationDate,
                           ).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                           {notification.patientId
                              ? notification.patientId.fullName
                              : '—'}
                        </TableCell>
                        <TableCell>{notification.diseaseCode}</TableCell>
                        <TableCell>{notification.residence}</TableCell>
                        <TableCell>{notification.medicalInstitution}</TableCell>
                        <TableCell align='center'>
                           <Button
                              component={Link}
                              to={`/notifications/${notification._id}/details`}
                           >
                              <Visibility />
                           </Button>
                           {isAdmin && (
                              <Button
                                 onClick={() => handleDelete(notification._id)}
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
