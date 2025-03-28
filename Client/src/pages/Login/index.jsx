import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

import styles from './Login.module.scss';
import { fetchAuth, selectIsAuth } from '../../redux/slices/auth';

export const Login = () => {
   const isAuth = useSelector(selectIsAuth);
   const dispatch = useDispatch();
   const {
      register,
      handleSubmit,
      setError,
      formState: { errors, isValid },
   } = useForm({
      defaultValues: {
         email: '',
         password: '',
      },
      mode: 'onChange',
   });

   const onSubmit = async (values) => {
      const data = await dispatch(fetchAuth(values));

      if (!data.payload) {
         alert('Не удалось авторизоваться');
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
            Вход в аккаунт
         </Typography>
         <form onSubmit={handleSubmit(onSubmit)}>
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
               Войти
            </Button>

            <h4 className={styles.register}>
               Нет аккаунта? <a href='/register'>Зарегистрироваться</a>
            </h4>
         </form>
      </Paper>
   );
};
