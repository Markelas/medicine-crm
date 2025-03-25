import mongoose from 'mongoose';
import express from 'express';
import multer from 'multer';
import dotenv from 'dotenv';
import cors from 'cors';
import { loginValidation, registerValidation } from './validations/auth.js';
import { UserController } from './controllers/index.js';
import { checkAuth, handleValidationErrors } from './utils/index.js';

import {
   addDiseaseRecord,
   createPatientCard,
   deletePatientCard,
   getAllPatientCards,
   getPatientCardById,
   updatePatientCard,
} from './controllers/PatientCardController.js';
import {
   createInvestigation,
   deleteInvestigation,
   getAllInvestigations,
   getInvestigationById,
   getPatientsWithDiseaseInLastMonth,
   updateInvestigation,
} from './controllers/EpidemiologicalInvestigationController.js';
import {
   createDisease,
   deleteDisease,
   getAllDiseases,
   getDiseaseByCode,
   updateDisease,
} from './controllers/DiseaseController.js';
import {
   createNotification,
   deleteNotification,
   getAllNotifications,
   getNotificationById,
   updateNotification,
} from './controllers/EmergencyNotificationController.js';
import { createPatientVisit } from './controllers/PatientVisitController.js';
import {
   createVaccination,
   deleteVaccination,
   getAllVaccinations,
   getVaccinationsByPatient,
   updateVaccination,
} from './controllers/VaccinationController.js';
import {
   createVaccine,
   deleteVaccine,
   getAllVaccines,
   getVaccineById,
   updateVaccine,
} from './controllers/VaccineController.js';
import {
   getCasesTrend,
   getGeneralStatistics,
   getVaccinationStats,
   getVaccinationImpact,
   getForecast,
} from './controllers/StatisticsController.js';
import { getAllUsers, updateUserRole } from './controllers/UserController.js';

dotenv.config(); // Загружаем переменные окружения
const mongoURI = process.env.MONGODB_URI; // Подключаемся к БД с помощью своего аккаунта

mongoose
   .connect(mongoURI) // Подключаемся к БД, параметр перед вопросительным знаком означает, к какой именно базе подключаемся
   .then(() => {
      console.log('DB ok');
   })
   .catch((err) => {
      console.log(err);
   });

const app = express();

// ----------- Используем multer для загрузки файлов --------------
const storage = multer.diskStorage({
   destination: (_, __, cb) => {
      cb(null, 'uploads'); // Первый параметр - что нет ошибок, второй - путь, куда будут загружаться файлы
   },
   filename: (_, file, cb) => {
      cb(null, file.originalname); // Имя файла будет такое же, как и имя при загрузке
   },
});

const upload = multer({ storage });

app.use(express.json()); // Позволяет читать json

app.use(cors());

app.use('/uploads', express.static('uploads')); // Подключаем папку с картинками, с помощью функции static (конкретный статичный файл) из папки uploads, теперь когда придет запрос на /uploads, то можно открыть в браузере картинку

// ----------- Вход и регистрация пользователя --------------
app.post(
   '/auth/login',
   [...loginValidation],
   handleValidationErrors,
   UserController.login,
);
app.post(
   '/auth/register',
   [...registerValidation],
   handleValidationErrors,
   UserController.register,
);
app.patch('/update-role', updateUserRole);
app.get('/users', getAllUsers);

// ----------- Middleware для проверки пользователя --------------
// Делаем middleware, которая будет проверять, можно ли просматривать страницу, это даёт защиту
// Вначале вызывается checkAuth, а затем уже переходит к другой части
// Этот запрос будет проверять, авторизован или нет
app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/upload', upload.single('image'), (req, res) => {
   try {
      res.status(200).json({
         message: 'File uploaded successfully',
         url: `/uploads/${req.file.filename}`,
      });
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
});

// ----------- Маршруты для карт пациентов --------------
app.get('/patient-cards', getAllPatientCards);
app.get('/patient-cards/:id', getPatientCardById);
app.post('/patient-cards', createPatientCard);
app.patch('/patient-cards/:id', updatePatientCard);
app.delete('/patient-cards/:id', deletePatientCard);
app.post('/patients/:id/diseases', addDiseaseRecord);

// ----------- Маршруты для экстренных извещений --------------
app.get('/notifications', getAllNotifications);
app.get('/notifications/:id', getNotificationById);
app.post('/notifications', createNotification);
app.patch('/notifications/:id', updateNotification);
app.delete('/notifications/:id', deleteNotification);

// ----------- Маршруты для эпидемиологических расследований --------------
app.get('/investigations', getAllInvestigations);
app.get('/investigations/:id', getInvestigationById);
app.post('/investigations', createInvestigation);
app.patch('/investigations/:id', updateInvestigation);
app.delete('/investigations/:id', deleteInvestigation);
app.get(
   '/investigations/disease/:diseaseCode/patients/last-month',
   getPatientsWithDiseaseInLastMonth,
);

// ----------- Маршруты для МКБ10 --------------
app.get('/diseases', getAllDiseases);
app.get('/diseases/:code', getDiseaseByCode);
app.post('/diseases', createDisease);
app.patch('/diseases/:code', updateDisease);
app.delete('/diseases/:code', deleteDisease);

// ----------- Маршруты для Вакцин --------------
app.get('/vaccines', getAllVaccines);
app.get('/vaccines/:code', getVaccineById);
app.post('/vaccines', createVaccine);
app.patch('/vaccines', updateVaccine);
app.delete('/vaccines/:code', deleteVaccine);

// ----------- Маршруты для вакцинации --------------
app.post('/vaccinations', createVaccination); // Добавить вакцинацию
app.get('/vaccinations', getAllVaccinations); // Получить все вакцинации
app.get('/vaccinations/:patientId', getVaccinationsByPatient); // Вакцинации конкретного пациента
app.patch('/vaccinations/:id', updateVaccination); // Обновить данные вакцинации
app.delete('/vaccinations/:id', deleteVaccination); // Удалить запись вакцинации

// ----------- Маршруты для визитов пациента --------------
app.post('/patient-visit', createPatientVisit); // Добавить визит
// app.get('/patient-visit', getAllPatientVisits); // Получить все визиты
// app.get('/patient-visit/:patientId', getPatientVisitsByPatient); // Визиты конкретного пациента
// app.patch('/patient-visit/:id', updatePatientVisit); // Обновить визит
// app.delete('/patient-visit/:id', deletePatientVisit); // Удалить визит

// ----------- Маршруты для статистики -------------------
app.get('/general', getGeneralStatistics); // Получение общей статистики
app.get('/cases-trend', getCasesTrend); // Получение тренда заболеваемости по месяцам
app.get('/vaccination-stats', getVaccinationStats); // Получение тренда заболеваемости по месяцам
app.get('/vaccination-impact', getVaccinationImpact);
app.get('/forecast', getForecast); // Прогноз по вакцинации

app.listen(5000, (err) => {
   if (err) console.log(err);

   console.log('Server OK');
});
