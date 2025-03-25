import { validationResult } from 'express-validator';

// Middleware для проверки валидации
export default (req, res, next) => {
   const errors = validationResult(req); // Проверяем валидацию
   if (!errors.isEmpty()) {
      // Если есть ошибки, то отображаем список
      return res.status(400).json({ errors: errors.array() });
   }

   next(); // Если ошибок нет, то далее
};
