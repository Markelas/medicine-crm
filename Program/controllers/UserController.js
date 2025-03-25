import bcrypt from 'bcrypt';
import UserModel from '../models/User.js';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const register = async (req, res) => {
   try {
      const password = req.body.password;
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      const isAdmin = req.body.isAdmin || false; // Роль по умолчанию - диспетчер

      const doc = new UserModel({
         fullName: req.body.fullName,
         email: req.body.email,
         passwordHash: hash,
         avatarUrl: req.body.avatarUrl,
         isAdmin,
      });

      const user = await doc.save(); //Сохраняем

      const token = jwt.sign(
         // Генерируем токен
         {
            _id: user._id,
            isAdmin: user.isAdmin, // Добавляем роль в токен
         },
         'secret123',
         {
            expiresIn: '30d',
         },
      );

      const { passwordHash, ...userData } = user._doc; // Исключаем пароль из результата

      res.json({ ...userData, token }); // Возвращаем ответ от сервера в виде userData и token
   } catch (err) {
      console.log(err);
      res.status(500).json({
         message: 'Не удалось зарегистрироваться',
      });
   }
};

export const login = async (req, res) => {
   try {
      const user = await UserModel.findOne({ email: req.body.email }); // Ищем пользователя в БД
      if (!user) {
         // Если пустой объект, то ошибка
         return res.status(404).json({
            message: 'Пользователь не найден',
         });
      }

      const isValidPass = await bcrypt.compare(
         req.body.password,
         user._doc.passwordHash,
      ); // Сравниваем пароли

      if (!isValidPass) {
         return res.status(400).json({
            message: 'Неверный логин или пароль',
         });
      }

      const token = jwt.sign(
         // Генерируем токен
         {
            _id: user._id,
            isAdmin: user.isAdmin, // Добавляем роль в токен
         },
         'secret123',
         {
            expiresIn: '30d',
         },
      );
      const { passwordHash, ...userData } = user._doc; // Исключаем пароль из результата

      res.json({ ...userData, token }); // Возвращаем ответ от сервера в виде userData и token
   } catch (err) {
      console.log(err);
      res.status(500).json({
         message: 'Не удалось авторизоваться',
      });
   }
};

export const getMe = async (req, res) => {
   try {
      const user = await UserModel.findById(req.userId); // Ищем пользователя в БД по id

      if (!user) {
         // Если не найден, то ошибка
         return res.status(404).json({
            message: 'Пользователь не найден',
         });
      }

      const { passwordHash, ...userData } = user._doc; // Исключаем пароль из результата

      res.json({ ...userData }); // Возвращаем ответ от сервера в виде userData и token
   } catch (err) {
      console.log(err);
      res.status(500).json({
         message: 'Нет доступа',
      });
   }
};

// Функция для изменения роли пользователя (isAdmin)
export const updateUserRole = async (req, res) => {
   try {
      const { userId, isAdmin } = req.body;

      // Поиск пользователя по ID
      const user = await User.findById(userId);
      if (!user) {
         return res.status(404).json({ message: 'Пользователь не найден' });
      }

      // Обновление роли пользователя
      user.isAdmin = isAdmin;

      await user.save();

      res.status(200).json({ message: 'Роль пользователя обновлена', user });
   } catch (error) {
      console.error(error);
      res.status(500).json({
         message: 'Не удалось обновить роль пользователя',
      });
   }
};

export const getAllUsers = async (req, res) => {
   try {
      // Получаем всех пользователей
      const users = await UserModel.find(); // Возвращаем всех пользователей

      // Исключаем пароль у каждого пользователя в списке
      const usersWithoutPassword = users.map((user) => {
         const { passwordHash, ...userData } = user._doc;
         return userData;
      });

      res.status(200).json(usersWithoutPassword); // Отправляем пользователей без пароля
   } catch (err) {
      console.log(err);
      res.status(500).json({
         message: 'Не удалось получить пользователей',
      });
   }
};
