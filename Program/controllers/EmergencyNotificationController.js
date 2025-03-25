import EmergencyNotification from '../models/EmergencyNotification.js';
import Disease from '../models/Disease.js';
import VaccinationRecord from '../models/VaccinationRecord.js';

// Получить все извещения
export const getAllNotifications = async (req, res) => {
   try {
      const notifications = await EmergencyNotification.find()
         .populate('patientId', 'fullName')
         .populate('diseaseCode', 'diseaseCode')
         .lean();

      const result = notifications.map((notification) => {
         if (notification.diseaseCode) {
            notification.diseaseCode = notification.diseaseCode.diseaseCode;
         }
         return notification;
      });

      res.json(result);
   } catch (err) {
      console.error(err);
      res.status(500).json({
         message: 'Не удалось получить извещения',
      });
   }
};

// Получить извещение по ID с историей вакцинаций
export const getNotificationById = async (req, res) => {
   try {
      const notificationId = req.params.id;

      // Ищем извещение с подгрузкой данных о пациенте и заболевании
      const notification = await EmergencyNotification.findById(notificationId)
         .populate('patientId') // Получаем пациента
         .populate('diseaseCode'); // Получаем информацию о заболевании

      if (!notification) {
         return res.status(404).json({
            message: 'Извещение не найдено',
         });
      }

      // Получаем информацию о заболевании
      const disease = await Disease.findById(notification.diseaseCode);

      if (!disease) {
         return res.status(404).json({
            message: 'Заболевание не найдено',
         });
      }

      let updatedNotification = { ...notification.toObject() }; // Создаем копию объекта notification

      // Добавляем информацию о заболевании в извещение
      updatedNotification.diseaseDetails = {
         diseaseCode: disease.diseaseCode, // Код болезни
         diseaseName: disease.diseaseName, // Название болезни
      };

      // Если история болезней существует, подгружаем её
      if (
         notification.patientId.diseasesHistory &&
         notification.patientId.diseasesHistory.length > 0
      ) {
         updatedNotification.patientId.diseasesHistory = await Promise.all(
            notification.patientId.diseasesHistory.map(async (record) => {
               // Для каждого заболевания из истории подгружаем название и код
               const diseaseDetails = await Disease.findById(record.diseaseId);
               return {
                  ...record.toObject(),
                  diseaseCode: diseaseDetails.diseaseCode, // Добавляем код болезни
                  diseaseName: diseaseDetails.diseaseName, // Добавляем название болезни
               };
            }),
         );
      }

      // Если история вакцинаций существует, подгружаем её
      if (
         notification.patientId.vaccinationHistory &&
         notification.patientId.vaccinationHistory.length > 0
      ) {
         // Подгружаем вакцины, ссылаясь на соответствующие идентификаторы
         const vaccinationRecords = await VaccinationRecord.find({
            _id: { $in: notification.patientId.vaccinationHistory }, // Ищем записи по _id вакцины
         })
            .populate('vaccineId', 'vaccineName') // Получаем название вакцины
            .lean();

         // Если вакцины найдены, подставляем их в историю вакцинаций
         if (vaccinationRecords && vaccinationRecords.length > 0) {
            updatedNotification.vaccinationHistory = vaccinationRecords.map(
               (record) => ({
                  vaccineName: record.vaccineId?.vaccineName, // Название вакцины
                  vaccinationDate: record.vaccinationDate,
                  boosterDate: record.boosterDate,
                  healthcareProvider: record.healthcareProvider,
               }),
            );
         } else {
            console.log('No vaccination records found for the patient');
         }
      } else {
         updatedNotification.vaccinationHistory = []; // Если вакцинаций нет
         console.log('No vaccination history in patient data');
      }

      // Отправляем результат
      res.json(updatedNotification);
   } catch (err) {
      console.error('Error fetching notification:', err);
      res.status(500).json({
         message: 'Не удалось получить извещение',
      });
   }
};

// Создать извещение
export const createNotification = async (req, res) => {
   try {
      const {
         patientId,
         diseaseCode, // diseaseCode будет строкой (например, "A04.6")
         notificationId,
         notificationDate,
         residence,
         medicalInstitution,
      } = req.body;

      // Находим болезнь по строковому коду
      const disease = await Disease.findOne({ diseaseCode });

      if (!disease) {
         return res
            .status(400)
            .json({ message: 'Болезнь с таким кодом не найдена' });
      }

      if (!patientId) {
         return res
            .status(400)
            .json({ message: 'Необходимо указать patientId' });
      }

      // Создание нового извещения, где diseaseCode - это ObjectId болезни
      const doc = new EmergencyNotification({
         notificationId,
         patientId,
         notificationDate,
         diseaseCode: disease, // Сохраняем ObjectId болезни
         residence,
         medicalInstitution,
      });

      const notification = await doc.save();
      res.json(notification);
   } catch (err) {
      console.error(err);
      res.status(500).json({
         message: 'Не удалось создать извещение',
      });
   }
};

// Обновить извещение
export const updateNotification = async (req, res) => {
   try {
      const notificationId = req.params.id;

      const updated = await EmergencyNotification.updateOne(
         { notificationId },
         {
            patientId: req.body.patientId,
            notificationDate: req.body.notificationDate,
            diseaseCode: req.body.diseaseCode,
            residence: req.body.residence,
            medicalInstitution: req.body.medicalInstitution,
         },
      );

      if (updated.modifiedCount === 0) {
         return res.status(404).json({
            message: 'Извещение не найдено',
         });
      }

      res.json({ success: true });
   } catch (err) {
      console.error(err);
      res.status(500).json({
         message: 'Не удалось обновить извещение',
      });
   }
};

// Удалить извещение
export const deleteNotification = async (req, res) => {
   try {
      const notificationId = req.params.id;

      const deleted =
         await EmergencyNotification.findByIdAndDelete(notificationId);

      if (!deleted) {
         return res.status(404).json({
            message: 'Извещение не найдено',
         });
      }

      res.json({ success: true });
   } catch (err) {
      console.error(err);
      res.status(500).json({
         message: 'Не удалось удалить извещение',
      });
   }
};
