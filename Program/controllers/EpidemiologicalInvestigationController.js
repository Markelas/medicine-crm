import EpidemiologicalInvestigation from '../models/EpidemiologicalInvestigation.js';
import EmergencyNotification from '../models/EmergencyNotification.js';
import Disease from '../models/Disease.js';
import PatientCard from '../models/PatientCard.js';

// Получить все расследования
export const getAllInvestigations = async (req, res) => {
   try {
      const investigations = await EpidemiologicalInvestigation.find()
         .populate('notificationId', 'notificationId notificationDate')
         .populate(
            'patientCardId',
            'fullName gender profession workplace homeAddress',
         )
         .populate('diseaseCode', 'diseaseCode diseaseName')
         .lean();

      // Добавляем информацию о пациенте в каждом расследовании
      investigations.forEach((investigation) => {
         const patient = investigation.patientCardId;
         investigation.patientDetails = {
            fullName: patient.fullName,
            gender: patient.gender,
            profession: patient.profession,
            workplace: patient.workplace,
            homeAddress: patient.homeAddress,
         };
      });

      res.json(investigations);
   } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Не удалось получить расследования' });
   }
};

// Получить расследование по ID
export const getInvestigationById = async (req, res) => {
   try {
      const investigationId = req.params.id;
      const investigation = await EpidemiologicalInvestigation.findById(
         investigationId,
      )
         .populate('notificationId', 'notificationId notificationDate')
         .populate(
            'patientCardId',
            'fullName gender profession workplace homeAddress',
         )
         .populate('diseaseCode', 'diseaseCode diseaseName')
         .lean();

      if (!investigation) {
         return res.status(404).json({
            message: 'Расследование не найдено',
         });
      }

      // Добавляем информацию о пациенте
      const patient = investigation.patientCardId;
      investigation.patientDetails = {
         fullName: patient.fullName,
         gender: patient.gender,
         profession: patient.profession,
         workplace: patient.workplace,
         homeAddress: patient.homeAddress,
      };

      res.json(investigation);
   } catch (err) {
      console.error(err);
      res.status(500).json({
         message: 'Не удалось получить расследование',
      });
   }
};

// Создать расследование
export const createInvestigation = async (req, res) => {
   try {
      const {
         investigationId,
         notificationId,
         patientCardId,
         diseaseCode,
         casesRegistered,
         laboratoryResearch,
         contactCircle,
         placeOfOccurrence,
         sourceOfInfection,
         infectionRisks,
      } = req.body;

      // Проверяем существование связанных данных
      const notification = await EmergencyNotification.findOne({
         notificationId,
      });
      if (!notification) {
         return res
            .status(400)
            .json({ message: 'Указанное извещение не найдено' });
      }

      const patientCard = await PatientCard.findOne({
         patientId: patientCardId,
      });
      if (!patientCard) {
         return res
            .status(400)
            .json({ message: 'Указанная карта пациента не найдена' });
      }

      const disease = await Disease.findOne({ diseaseCode });
      if (!disease) {
         return res
            .status(400)
            .json({ message: 'Болезнь с указанным кодом не найдена' });
      }

      const doc = new EpidemiologicalInvestigation({
         investigationId,
         notificationId: notification._id,
         patientCardId: patientCard._id,
         diseaseCode: disease._id,
         casesRegistered,
         laboratoryResearch,
         contactCircle,
         placeOfOccurrence,
         sourceOfInfection,
         infectionRisks,
      });

      const investigation = await doc.save();
      res.status(201).json(investigation);
   } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Не удалось создать расследование' });
   }
};

// Обновить расследование
export const updateInvestigation = async (req, res) => {
   try {
      const investigationId = req.params.id;
      const {
         contactCircle,
         placeOfOccurrence,
         sourceOfInfection,
         infectionRisks,
         ...updateFields
      } = req.body;

      // Формируем данные для обновления
      const updatedFields = {
         ...updateFields,
         ...(contactCircle && { contactCircle }),
         ...(placeOfOccurrence && { placeOfOccurrence }),
         ...(sourceOfInfection && { sourceOfInfection }),
         ...(infectionRisks && { infectionRisks }),
      };

      const updatedInvestigation =
         await EpidemiologicalInvestigation.findByIdAndUpdate(
            investigationId,
            updatedFields,
            { new: true },
         );

      if (!updatedInvestigation) {
         return res.status(404).json({ message: 'Расследование не найдено' });
      }

      res.json(updatedInvestigation);
   } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Не удалось обновить расследование' });
   }
};

// Удалить расследование
export const deleteInvestigation = async (req, res) => {
   try {
      const investigationId = req.params.id;

      const deleted =
         await EpidemiologicalInvestigation.findByIdAndDelete(investigationId);

      if (!deleted) {
         return res.status(404).json({
            message: 'Расследование не найдено',
         });
      }

      res.json({ success: true });
   } catch (err) {
      console.error(err);
      res.status(500).json({
         message: 'Не удалось удалить расследование',
      });
   }
};

// Получить пациентов, у которых обнаружена болезнь за последний месяц
export const getPatientsWithDiseaseInLastMonth = async (req, res) => {
   try {
      const diseaseCode = req.params.diseaseCode; // код болезни из параметров запроса

      // Ищем болезнь по её коду
      const disease = await Disease.findOne({ diseaseCode });

      if (!disease) {
         return res
            .status(404)
            .json({ message: 'Болезнь с таким кодом не найдена' });
      }

      // Получаем текущую дату
      const currentDate = new Date();

      // Вычисляем дату одного месяца назад
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(currentDate.getMonth() - 1);

      // Ищем все расследования, связанные с заболеванием за последний месяц
      const investigations = await EpidemiologicalInvestigation.find({
         diseaseCode: disease._id, // Используем ObjectId болезни
         createdAt: { $gte: oneMonthAgo }, // Фильтруем по дате
      })
         .populate('patientCardId', 'fullName') // Получаем данные о пациенте
         .lean();

      // Получаем только список пациентов
      const patients = investigations.map(
         (investigation) => investigation.patientCardId,
      );

      res.json(patients);
   } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Не удалось получить пациентов' });
   }
};
