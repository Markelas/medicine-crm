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
import styles from './InvestigationsPage.module.scss';
import {
   fetchInvestigations,
   fetchRemoveInvestigation,
} from '../../../redux/slices/investigations';
import { Delete, Visibility } from '@mui/icons-material';
import { selectIsAdmin } from '../../../redux/slices/auth';

export const InvestigationsPage = () => {
   const dispatch = useDispatch();
   const { investigations } = useSelector((state) => state.investigations);
   const isAdmin = useSelector(selectIsAdmin);

   useEffect(() => {
      dispatch(fetchInvestigations());
   }, [dispatch]);

   const handleDelete = async (id) => {
      if (
         window.confirm('Вы действительно хотите удалить это расследование?')
      ) {
         dispatch(fetchRemoveInvestigation(id));
      }
   };

   if (investigations.status === 'loading') {
      return <div>Загрузка...</div>;
   }

   if (investigations.status === 'error') {
      return <div>Произошла ошибка при загрузке данных</div>;
   }

   const sortedInvestigations = [...investigations.items].sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
   });

   return (
      <div className={styles.container}>
         <div className={styles.header}>
            <h1>Эпидемиологические расследования</h1>
            {/*<Button*/}
            {/*   variant='contained'*/}
            {/*   color='primary'*/}
            {/*   component={Link}*/}
            {/*   to='/investigations/create'*/}
            {/*   className={styles.buttonAddInvestigation}*/}
            {/*>*/}
            {/*   Добавить расследование*/}
            {/*</Button>*/}
         </div>
         <Paper className={styles.tableContainer}>
            <Table>
               <TableHead>
                  <TableRow className={styles.tableHeader}>
                     <TableCell>ID расследования</TableCell>
                     <TableCell>ID извещения</TableCell>
                     <TableCell>ФИО пациента</TableCell>
                     <TableCell>Код болезни</TableCell>
                     <TableCell>Название болезни</TableCell>
                     <TableCell>Зарегистрировано случаев</TableCell>
                     <TableCell align='center'>Действия</TableCell>
                  </TableRow>
               </TableHead>
               <TableBody>
                  {sortedInvestigations.map((investigation) => (
                     <TableRow
                        key={investigation._id}
                        className={styles.tableRow}
                     >
                        <TableCell>{investigation.investigationId}</TableCell>
                        <TableCell>
                           {investigation.notificationId?.notificationId || '—'}
                        </TableCell>
                        <TableCell>
                           {investigation.patientCardId?.fullName || '—'}
                        </TableCell>
                        <TableCell>
                           {investigation.diseaseCode?.diseaseCode || '—'}
                        </TableCell>
                        <TableCell>
                           {investigation.diseaseCode?.diseaseName || '—'}
                        </TableCell>
                        <TableCell>{investigation.casesRegistered}</TableCell>
                        <TableCell align='center'>
                           <Button
                              component={Link}
                              to={`/investigations/${investigation._id}/details`}
                           >
                              <Visibility />
                           </Button>
                           {isAdmin && (
                              <Button
                                 onClick={() => handleDelete(investigation._id)}
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
