import PatientCard from '../models/PatientCard.js';
import Disease from '../models/Disease.js';
import EmergencyNotification from '../models/EmergencyNotification.js';
import EpidemiologicalInvestigation from '../models/EpidemiologicalInvestigation.js';

// Получить все карты пациентов
export const getAllPatientCards = async (req, res) => {
   try {
      const { search } = req.query; // Получаем параметр поиска из query string
      const query = search
         ? { fullName: { $regex: search, $options: 'i' } } // Регулярное выражение для поиска по имени и фамилии, с игнорированием регистра
         : {};

      const cards = await PatientCard.find(query);
      res.json(cards);
   } catch (err) {
      console.error(err);
      res.status(500).json({
         message: 'Не удалось получить карты пациентов',
      });
   }
};

// Получить одну карту по ID
export const getPatientCardById = async (req, res) => {
   try {
      const cardId = req.params.id;
      const card = await PatientCard.findById(cardId)
         .populate({
            path: 'diseasesHistory.diseaseId', // Заполняем поле diseaseId в истории болезней
            select: 'diseaseName diseaseCode', // Загружаем только name и code
         })
         .populate({
            path: 'vaccinationHistory', // Заполняем поле vaccinationHistory
            populate: { path: 'vaccineId', select: 'vaccineName' }, // Загружаем информацию о вакцине
         });

      if (!card) {
         return res.status(404).json({
            message: 'Карта пациента не найдена',
         });
      }

      res.json(card);
   } catch (err) {
      console.error(err);
      res.status(500).json({
         message: 'Не удалось получить карту пациента',
      });
   }
};

// Создать карту пациента
export const createPatientCard = async (req, res) => {
   try {
      const doc = new PatientCard({
         patientId: req.body.patientId,
         fullName: req.body.fullName,
         gender: req.body.gender,
         dateOfBirth: req.body.dateOfBirth,
         diseaseCode: req.body.diseaseCode,
         symptoms: req.body.symptoms,
         profession: req.body.profession,
         workplace: req.body.workplace,
         homeAddress: req.body.homeAddress,
         passportData: req.body.passportData,
         medicalInstitution: req.body.medicalInstitution,
      });

      const card = await doc.save();
      res.json(card);
   } catch (err) {
      console.error(err);
      res.status(500).json({
         message: 'Не удалось создать карту пациента',
      });
   }
};

// Обновить карту пациента
export const updatePatientCard = async (req, res) => {
   try {
      const cardId = req.params.id; // Получаем _id из параметров URL

      const updated = await PatientCard.updateOne(
         { _id: cardId }, // Поиск производится по _id
         {
            fullName: req.body.fullName,
            gender: req.body.gender,
            dateOfBirth: req.body.dateOfBirth,
            diseaseCode: req.body.diseaseCode,
            symptoms: req.body.symptoms,
            profession: req.body.profession,
            workplace: req.body.workplace,
            homeAddress: req.body.homeAddress,
            passportData: req.body.passportData,
            medicalInstitution: req.body.medicalInstitution,
         },
      );

      if (updated.modifiedCount === 0) {
         return res.status(404).json({
            message: 'Карта пациента не найдена',
         });
      }

      res.json({ success: true });
   } catch (err) {
      console.error(err);
      res.status(500).json({
         message: 'Не удалось обновить карту пациента',
      });
   }
};

// Удалить карту пациента
export const deletePatientCard = async (req, res) => {
   try {
      const cardId = req.params.id; // Получаем _id из параметров

      const deleted = await PatientCard.findByIdAndDelete(cardId);

      if (!deleted) {
         return res.status(404).json({
            message: 'Карта пациента не найдена',
         });
      }

      res.json({ success: true });
   } catch (err) {
      console.error(err);
      res.status(500).json({
         message: 'Не удалось удалить карту пациента',
      });
   }
};

// Визит пациента
export const addDiseaseRecord = async (req, res) => {
   try {
      const { id } = req.params; // ID пациента
      const {
         diseaseId,
         diagnosisDate,
         recoveryDate,
         symptoms,
         treatment,
         notes,
      } = req.body;

      // Найти болезнь по ID
      const disease = await Disease.findById(diseaseId);
      if (!disease) {
         return res.status(404).json({ message: 'Заболевание не найдено' });
      }

      // Создаем новую запись о болезни в карте пациента
      const newDisease = {
         diseaseId,
         diagnosisDate,
         recoveryDate,
         symptoms,
         treatment,
         notes,
      };

      const updatedPatient = await PatientCard.findByIdAndUpdate(
         id,
         { $push: { diseasesHistory: newDisease } },
         { new: true },
      ).populate({
         path: 'diseasesHistory.diseaseId',
         select: 'diseaseName diseaseCode',
      });

      if (!updatedPatient) {
         return res.status(404).json({ message: 'Карта пациента не найдена' });
      }

      // Проверяем, превышен ли эпидпорог за последний месяц
      const casesCount = await PatientCard.countDocuments({
         'diseasesHistory.diseaseId': diseaseId,
         'diseasesHistory.diagnosisDate': {
            $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // За последний месяц (30 дней)
         },
      });

      if (disease.isEmergency) {
         const emergencyNotification = new EmergencyNotification({
            notificationId: `EN-${Date.now()}`, // Уникальный ID извещения
            patientId: id,
            notificationDate: new Date(),
            diseaseCode: disease._id,
            diseaseName: disease.diseaseName,
            residence: updatedPatient.homeAddress,
            medicalInstitution: updatedPatient.medicalInstitution,
         });

         await emergencyNotification.save();
         if (disease.epidThreshold && casesCount >= disease.epidThreshold) {
            const investigationId = Date.now();

            // Создаем расследование
            const investigation = new EpidemiologicalInvestigation({
               investigationId: investigationId,
               notificationId: emergencyNotification._id,
               patientCardId: id,
               diseaseCode: disease._id,
               casesRegistered: casesCount,
               laboratoryResearch: 'В процессе...',
            });

            await investigation.save(); // Сохраняем расследование
         }
      }

      res.json(updatedPatient);
   } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Не удалось обновить историю болезней' });
   }
};
