import React from 'react';
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableRow,
   Button,
} from '@mui/material';
import styles from '../../PatientCard/PatientCardsPage/PatientCardsPage.module.scss';

const DiseasesTable = ({ diseases, handleDelete, isAdmin }) => {
   return (
      <Table>
         <TableHead>
            <TableRow className={styles.tableHeader}>
               <TableCell>Код болезни</TableCell>
               <TableCell>Название болезни</TableCell>
               <TableCell>Порог случаев</TableCell>
               <TableCell>Опасная инфекционная болезнь</TableCell>
               {isAdmin && <TableCell align='right'>Действия</TableCell>}
            </TableRow>
         </TableHead>
         <TableBody>
            {diseases.map((disease) => (
               <TableRow key={disease._id} className={styles.tableRow}>
                  <TableCell>{disease.diseaseCode}</TableCell>
                  <TableCell>{disease.diseaseName}</TableCell>
                  <TableCell>
                     {disease.epidThreshold ? disease.epidThreshold : '-'}
                  </TableCell>
                  <TableCell>{disease.isEmergency ? 'Да' : 'Нет'}</TableCell>
                  {isAdmin && (
                     <TableCell align='right'>
                        <Button
                           variant='outlined'
                           onClick={() => handleDelete(disease._id)}
                           color='error'
                        >
                           Удалить
                        </Button>
                     </TableCell>
                  )}
               </TableRow>
            ))}
         </TableBody>
      </Table>
   );
};

export default DiseasesTable;
