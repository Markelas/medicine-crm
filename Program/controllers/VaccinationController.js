import VaccinationRecord from '../models/VaccinationRecord.js';
import PatientCard from '../models/PatientCard.js';

// Добавить вакцинацию
export const createVaccination = async (req, res) => {
   try {
      const {
         patientId,
         vaccineId,
         vaccinationDate,
         boosterDate,
         healthcareProvider,
      } = req.body;

      // Находим пациента по ID
      const patient = await PatientCard.findById(patientId);
      if (!patient) {
         return res.status(404).json({ message: 'Пациент не найден' });
      }

      // Создаем новую запись о вакцинации
      const newVaccination = new VaccinationRecord({
         patientId,
         vaccineId,
         vaccinationDate,
         boosterDate,
         healthcareProvider,
      });

      // Сохраняем вакцинацию
      await newVaccination.save();

      // Добавляем запись о вакцинации в историю вакцинаций пациента
      patient.vaccinationHistory.push(newVaccination._id);

      // Сохраняем обновленную карту пациента
      await patient.save();

      // Возвращаем созданную вакцинацию в ответ
      res.status(201).json(newVaccination);
   } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Ошибка при добавлении вакцинации' });
   }
};

// Получить все вакцинации
export const getAllVaccinations = async (req, res) => {
   try {
      const vaccinations = await VaccinationRecord.find().populate('vaccineId');
      res.json(vaccinations);
   } catch (err) {
      console.error(err);
      res.status(500).json({
         message: 'Ошибка при получении списка вакцинаций',
      });
   }
};

// Получить вакцинации конкретного пациента
export const getVaccinationsByPatient = async (req, res) => {
   try {
      const vaccinations = await VaccinationRecord.find({
         patientId: req.params.patientId,
      }).populate('vaccineId');
      res.json(vaccinations);
   } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Ошибка при получении данных пациента' });
   }
};

// Обновить вакцинацию
export const updateVaccination = async (req, res) => {
   try {
      const updatedVaccination = await VaccinationRecord.findByIdAndUpdate(
         req.params.id,
         req.body,
         { new: true },
      );
      res.json(updatedVaccination);
   } catch (err) {
      console.error(err);
      res.status(500).json({
         message: 'Ошибка при обновлении данных вакцинации',
      });
   }
};

// Удалить вакцинацию
export const deleteVaccination = async (req, res) => {
   try {
      await VaccinationRecord.findByIdAndDelete(req.params.id);
      res.json({ success: true });
   } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Ошибка при удалении вакцинации' });
   }
};
