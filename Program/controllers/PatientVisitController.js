import PatientCard from '../models/PatientCard.js';
import VaccinationRecord from '../models/VaccinationRecord.js';
import Vaccine from '../models/Vaccine.js';
import Disease from '../models/Disease.js';

export const createPatientVisit = async (req, res) => {
   try {
      const { patientId, diseaseCode, symptoms, treatment, notes } = req.body;

      let patient = await PatientCard.findOne({ patientId });
      if (!patient) {
         return res.status(404).json({ message: 'Пациент не найден' });
      }

      // Проверяем болезнь
      const disease = await Disease.findOne({ diseaseCode });
      if (!disease) {
         return res.status(404).json({ message: 'Болезнь не найдена' });
      }

      // Проверяем, была ли сделана вакцина от этой болезни
      const vaccine = await Vaccine.findOne({ targetDiseases: disease._id });
      if (vaccine) {
         const vaccinationRecord = await VaccinationRecord.findOne({
            patientId: patient._id,
            vaccineId: vaccine._id,
         });

         if (vaccinationRecord) {
            console.log(
               `Пациент вакцинирован вакциной ${vaccine.vaccineName} (${vaccinationRecord.vaccinationDate})`,
            );
         } else {
            console.log(
               `Пациент НЕ вакцинирован против ${disease.diseaseName}`,
            );
         }
      }

      // Добавляем запись в историю болезней пациента
      patient.diseasesHistory.push({
         diseaseId: disease._id,
         diagnosisDate: new Date(),
         symptoms,
         treatment,
         notes,
      });

      await patient.save();

      res.status(201).json({ message: 'Прием пациента записан' });
   } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Ошибка обработки приема пациента' });
   }
};
