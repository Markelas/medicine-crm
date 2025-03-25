import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Select, MenuItem, InputLabel, FormControl } from '@mui/material';

import styles from './AddPatientCard.module.scss';
import { TOKEN } from '../../../consts';

export const AddPatientCard = () => {
   const { id } = useParams();
   const navigate = useNavigate();
   const [isLoading, setIsLoading] = useState(false);

   const [fullName, setFullName] = useState('');
   const [patientId, setPatientId] = useState('');
   const [gender, setGender] = useState('');
   const [dateOfBirth, setDateOfBirth] = useState('');
   const [profession, setProfession] = useState('');
   const [workplace, setWorkplace] = useState('');
   const [homeAddress, setHomeAddress] = useState('');
   const [passportData, setPassportData] = useState('');
   const [medicalInstitution, setMedicalInstitution] = useState('');

   const isEditing = !!id;

   const onSubmit = async () => {
      try {
         setIsLoading(true);

         const fields = {
            fullName,
            patientId,
            gender,
            dateOfBirth,
            profession,
            workplace,
            homeAddress,
            passportData,
            medicalInstitution,
         };

         const { data } = isEditing
            ? await axios.patch(
                 `http://localhost:5000/patient-cards/${id}`,
                 fields,
                 {
                    headers: { Authorization: TOKEN },
                 },
              )
            : await axios.post('http://localhost:5000/patient-cards', fields, {
                 headers: { Authorization: TOKEN },
              });

         const _id = isEditing ? id : data._id;

         navigate(`/patient-cards/${_id}`);
      } catch (err) {
         console.error(err);
         alert('Ошибка при сохранении карты пациента');
      } finally {
         setIsLoading(false);
      }
   };

   useEffect(() => {
      if (id) {
         axios
            .get(`http://localhost:5000/patient-cards/${id}`, {
               headers: { Authorization: TOKEN },
            })
            .then(({ data }) => {
               const formattedDate = data.dateOfBirth.split('T')[0];

               setFullName(data.fullName);
               setPatientId(data.patientId);
               setGender(data.gender);
               setDateOfBirth(formattedDate);
               setProfession(data.profession);
               setWorkplace(data.workplace);
               setHomeAddress(data.homeAddress);
               setPassportData(data.passportData);
               setMedicalInstitution(data.medicalInstitution);
            })
            .catch((err) => {
               console.error(err);
               alert('Ошибка при загрузке карты пациента');
            });
      }
   }, [id]);

   return (
      <Paper style={{ padding: 30 }}>
         <TextField
            label='Полное имя'
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            variant='outlined'
            fullWidth
            margin='normal'
         />
         <TextField
            label='ID пациента'
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            variant='outlined'
            fullWidth
            margin='normal'
         />
         <FormControl fullWidth variant='outlined' margin='normal'>
            <InputLabel id='gender-select-label'>Пол</InputLabel>
            <Select
               labelId='gender-select-label'
               value={gender}
               onChange={(e) => setGender(e.target.value)}
               label='Пол'
            >
               <MenuItem value='Male'>Мужчина</MenuItem>
               <MenuItem value='Female'>Женщина</MenuItem>
            </Select>
         </FormControl>
         <TextField
            label='Дата рождения'
            type='date'
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            variant='outlined'
            fullWidth
            margin='normal'
            InputLabelProps={{
               shrink: true,
            }}
         />
         <TextField
            label='Профессия'
            value={profession}
            onChange={(e) => setProfession(e.target.value)}
            variant='outlined'
            fullWidth
            margin='normal'
         />
         <TextField
            label='Место работы'
            value={workplace}
            onChange={(e) => setWorkplace(e.target.value)}
            variant='outlined'
            fullWidth
            margin='normal'
         />
         <TextField
            label='Домашний адрес'
            value={homeAddress}
            onChange={(e) => setHomeAddress(e.target.value)}
            variant='outlined'
            fullWidth
            margin='normal'
         />
         <TextField
            label='Паспортные данные'
            value={passportData}
            onChange={(e) => setPassportData(e.target.value)}
            variant='outlined'
            fullWidth
            margin='normal'
         />
         <TextField
            label='Медицинское учреждение'
            value={medicalInstitution}
            onChange={(e) => setMedicalInstitution(e.target.value)}
            variant='outlined'
            fullWidth
            margin='normal'
         />

         <div className={styles.buttons}>
            <Button
               onClick={onSubmit}
               size='large'
               variant='contained'
               disabled={isLoading}
            >
               {isEditing ? 'Сохранить' : 'Создать'}
            </Button>
            <Link to='/patient-cards'>
               <Button size='large'>Отмена</Button>
            </Link>
         </div>
      </Paper>
   );
};
