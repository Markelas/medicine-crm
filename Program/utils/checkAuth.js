import jwt from 'jsonwebtoken';

// Делаем middleware, которая будет проверять, можно ли просматривать страницу
export default (req, res, next) => {
   const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
   console.log('token', token); // Выводим токен для отладки

   if (token) {
      try {
         const decoded = jwt.verify(token, 'secret123'); // Проверяем токен
         req.userId = decoded._id; // Присваиваем ID пользователя из токена

         next(); // Пропускаем запрос дальше
      } catch (err) {
         console.log('Token verification failed:', err); // Логируем ошибку
         return res.status(403).json({
            message: 'Нет доступа',
         });
      }
   } else {
      console.log('No token found'); // Логируем отсутствие токена
      return res.status(403).json({
         message: 'Нет доступа',
      });
   }
};
