import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuth } from './redux/slices/auth'; // Импортируйте селектор для проверки авторизации

const PrivateRoute = ({ children }) => {
   const isAuth = useSelector(selectIsAuth); // Проверяем, авторизован ли пользователь

   if (!isAuth) {
      return <Navigate to='/login' replace />; // Если пользователь не авторизован, перенаправляем на /login
   }

   return children; // Если авторизован, рендерим дочерние компоненты
};

export default PrivateRoute;
