import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';

import styles from './Login.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import {
   fetchAuth,
   fetchRegister,
   selectIsAuth,
} from '../../redux/slices/auth';
import { useForm } from 'react-hook-form';
import { Navigate } from 'react-router-dom';

export const Registration = () => {
   const isAuth = useSelector(selectIsAuth);
   const dispatch = useDispatch();
   const {
      register,
      handleSubmit,
      formState: { errors, isValid },
   } = useForm({
      defaultValues: {
         fullName: '',
         email: '',
         password: '',
      },
      mode: 'onChange',
   });

   const onSubmit = async (values) => {
      const data = await dispatch(fetchRegister(values));

      if (!data.payload) {
         alert('Не удалось зарегистрироваться');
      }

      // Во время попытки авторизоваться, будем проверять, получили ли мы токен
      if (data?.payload?.token) {
         window.localStorage.setItem('token', data.payload.token);
      }
   };

   if (isAuth) {
      return <Navigate to='/' />;
   }

   return (
      <Paper classes={{ root: styles.root }}>
         <Typography classes={{ root: styles.title }} variant='h5'>
            Создание аккаунта
         </Typography>
         <div className={styles.avatar}>
            <Avatar sx={{ width: 100, height: 100 }} />
         </div>
         <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
               className={styles.field}
               label='Полное имя'
               error={!!errors?.fullName?.message}
               helperText={errors?.fullName?.message}
               {...register('fullName', { required: 'Укажите полное имя' })}
               fullWidth
            />
            <TextField
               className={styles.field}
               label='E-Mail'
               type='email'
               error={!!errors?.email?.message}
               helperText={errors?.email?.message}
               {...register('email', { required: 'Укажите почту' })}
               fullWidth
            />
            <TextField
               className={styles.field}
               label='Пароль'
               error={!!errors?.password?.message}
               helperText={errors?.password?.message}
               {...register('password', { required: 'Укажите пароль' })}
               fullWidth
            />
            <Button
               disabled={!isValid}
               type='submit'
               size='large'
               variant='contained'
               fullWidth
            >
               Зарегистрироваться
            </Button>

            <h4 className={styles.login}>
               Есть аккаунт? <a href='/login'>Войти</a>
            </h4>
         </form>
      </Paper>
   );
};
