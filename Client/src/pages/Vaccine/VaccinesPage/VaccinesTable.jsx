import React from 'react';
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableRow,
   Button,
} from '@mui/material';
import styles from './VaccinesPage.module.scss';

const VaccinesTable = ({ vaccines, handleDelete, isAdmin }) => {
   return (
      <Table>
         <TableHead>
            <TableRow className={styles.tableHeader}>
               <TableCell>Название вакцины</TableCell>
               <TableCell>Производитель</TableCell>
               <TableCell>Против каких болезней предназначена</TableCell>
               <TableCell>Эффективность (%)</TableCell>
               <TableCell>Рекомендуемый возраст</TableCell>
               {isAdmin && <TableCell align='right'>Действия</TableCell>}
            </TableRow>
         </TableHead>
         <TableBody>
            {vaccines.length ? (
               vaccines.map((vaccine) => (
                  <TableRow key={vaccine._id} className={styles.tableRow}>
                     <TableCell>{vaccine.vaccineName}</TableCell>
                     <TableCell>{vaccine.manufacturer}</TableCell>
                     <TableCell>
                        {vaccine?.targetDiseases?.length > 0
                           ? vaccine.targetDiseases.map((targetDisease) => (
                                <span key={targetDisease._id}>
                                   {targetDisease.diseaseName} (код -
                                   {targetDisease.diseaseCode})
                                </span>
                             ))
                           : '-'}
                     </TableCell>
                     <TableCell>{vaccine.efficacyRate}</TableCell>
                     <TableCell>{vaccine.recommendedAge || '-'}</TableCell>
                     {isAdmin && (
                        <TableCell align='right'>
                           <Button
                              variant='outlined'
                              onClick={() => handleDelete(vaccine._id)}
                              color='error'
                           >
                              Удалить
                           </Button>
                        </TableCell>
                     )}
                  </TableRow>
               ))
            ) : (
               <h4 className={styles.notFoundText}>Вакцины не найдены</h4>
            )}
         </TableBody>
      </Table>
   );
};

export default VaccinesTable;
