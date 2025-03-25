import React, { useState, useEffect } from 'react';
import {
   Dialog,
   DialogActions,
   DialogContent,
   DialogTitle,
   Button,
   TextField,
} from '@mui/material';

export const VaccinationEditDialog = ({
   open,
   onClose,
   vaccination,
   onSave,
}) => {
   const [vaccinationData, setVaccinationData] = useState(vaccination);

   useEffect(() => {
      setVaccinationData(vaccination);
   }, [vaccination]);

   const handleChange = (e) => {
      const { name, value } = e.target;
      setVaccinationData((prev) => ({
         ...prev,
         [name]: value,
      }));
   };

   const handleSave = () => {
      onSave(vaccinationData);
      onClose();
   };

   return (
      <Dialog open={open} onClose={onClose}>
         <DialogTitle>Редактировать вакцинацию</DialogTitle>
         <DialogContent>
            <TextField
               label='Вакцина'
               name='vaccineName'
               value={vaccinationData?.vaccineId?.vaccineName || ''}
               onChange={handleChange}
               fullWidth
               margin='normal'
            />
            <TextField
               label='Дата вакцинации'
               name='vaccinationDate'
               type='date'
               value={
                  vaccinationData?.vaccinationDate
                     ? new Date(vaccinationData.vaccinationDate)
                          .toISOString()
                          .split('T')[0]
                     : ''
               }
               onChange={handleChange}
               fullWidth
               margin='normal'
               InputLabelProps={{
                  shrink: true,
               }}
            />
            <TextField
               label='Дата ревакцинации'
               name='boosterDate'
               type='date'
               value={
                  vaccinationData?.boosterDate
                     ? new Date(vaccinationData.boosterDate)
                          .toISOString()
                          .split('T')[0]
                     : ''
               }
               onChange={handleChange}
               fullWidth
               margin='normal'
               InputLabelProps={{
                  shrink: true,
               }}
            />
            <TextField
               label='Место вакцинации'
               name='healthcareProvider'
               value={vaccinationData?.healthcareProvider || ''}
               onChange={handleChange}
               fullWidth
               margin='normal'
            />
         </DialogContent>
         <DialogActions>
            <Button onClick={onClose} color='secondary'>
               Отмена
            </Button>
            <Button onClick={handleSave} color='primary'>
               Сохранить
            </Button>
         </DialogActions>
      </Dialog>
   );
};
