import PatientCard from '../models/PatientCard.js';
import VaccinationRecord from '../models/VaccinationRecord.js';
import Disease from '../models/Disease.js';
import EmergencyNotification from '../models/EmergencyNotification.js';
import { create, all } from 'mathjs';

// 1. Получение общей статистики
export const getGeneralStatistics = async (req, res) => {
   try {
      const totalPatients = await PatientCard.countDocuments();
      const totalDiseases = await Disease.countDocuments();
      const totalVaccinations = await VaccinationRecord.countDocuments();
      const totalEmergencyNotifications =
         await EmergencyNotification.countDocuments();

      const avgDiseasesPerPatient = (totalDiseases / totalPatients).toFixed(2);
      const avgEmergencyNotificationsPerPatient = (
         totalEmergencyNotifications / totalPatients
      ).toFixed(2);

      res.json({
         totalPatients,
         totalDiseases,
         totalVaccinations,
         totalEmergencyNotifications,
         avgDiseasesPerPatient,
         avgEmergencyNotificationsPerPatient,
      });
   } catch (error) {
      console.error('Ошибка при получении статистики:', error);
      res.status(500).json({ message: 'Ошибка получения данных' });
   }
};

// 2. Получение тренда заболеваемости по месяцам
export const getCasesTrend = async (req, res) => {
   try {
      const today = new Date();
      today.setMonth(today.getMonth() + 1);


      const startDate = new Date('2024-01-01');

      const endDate = today;

      const casesTrend = await PatientCard.aggregate([
         {
            $unwind: '$diseasesHistory',
         },
         {
            $match: {
               'diseasesHistory.diagnosisDate': {
                  $gte: startDate,
                  $lte: endDate,
               },
            },
         },
         {
            $group: {
               _id: {
                  year: { $year: '$diseasesHistory.diagnosisDate' },
                  month: { $month: '$diseasesHistory.diagnosisDate' },
               },
               cases: { $sum: 1 },
            },
         },
         {
            $sort: { '_id.year': 1, '_id.month': 1 },
         },
      ]);

      res.json(casesTrend);
   } catch (error) {
      console.error('Ошибка при получении тренда заболеваемости:', error);
      res.status(500).json({ message: 'Ошибка получения данных' });
   }
};

// 3. Получение статистики вакцинации
export const getVaccinationStats = async (req, res) => {
   try {
      const vaccinationStats = await VaccinationRecord.aggregate([
         {
            $group: {
               _id: '$vaccineId',
               totalVaccinated: { $sum: 1 },
            },
         },
         {
            $lookup: {
               from: 'vaccines',
               localField: '_id',
               foreignField: '_id',
               as: 'vaccineInfo',
            },
         },
         {
            $project: {
               vaccineName: { $arrayElemAt: ['$vaccineInfo.vaccineName', 0] },
               totalVaccinated: 1,
            },
         },
      ]);

      res.json(vaccinationStats);
   } catch (error) {
      console.error('Ошибка при получении статистики вакцинации:', error);
      res.status(500).json({ message: 'Ошибка получения данных' });
   }
};

export const getVaccinationImpact = async (req, res) => {
   try {
      const data = await Disease.aggregate([
         {
            $match: { isEmergency: true },
         },
         {
            $lookup: {
               from: 'patientcards',
               localField: '_id',
               foreignField: 'diseasesHistory.diseaseId',
               as: 'sickPatients',
            },
         },
         {
            $lookup: {
               from: 'vaccines',
               localField: '_id',
               foreignField: 'targetDiseases',
               as: 'relatedVaccines',
            },
         },
         {
            $lookup: {
               from: 'vaccinationrecords',
               localField: 'relatedVaccines._id',
               foreignField: 'vaccineId',
               as: 'vaccinatedPatients',
            },
         },
         {
            $project: {
               _id: 1,
               diseaseName: 1,
               cases: { $size: '$sickPatients' },
               vaccinationRate: {
                  $cond: {
                     if: { $eq: [{ $size: '$sickPatients' }, 0] },
                     then: 0,
                     else: {
                        $toDouble: {
                           $min: [
                              {
                                 $multiply: [
                                    {
                                       $divide: [
                                          { $size: '$vaccinatedPatients' },
                                          { $size: '$sickPatients' },
                                       ],
                                    },
                                    100,
                                 ],
                              },
                              100,
                           ],
                        },
                     },
                  },
               },
            },
         },
         { $sort: { cases: -1 } }, // Сортировка по количеству заболевших
         { $limit: 5 }, // Топ-5 заболеваний
      ]);

      // Округляем до 2 знаков после запятой
      const formattedData = data.map((item) => ({
         ...item,
         vaccinationRate: parseFloat(item.vaccinationRate.toFixed(2)),
      }));

      res.json(formattedData);
   } catch (error) {
      console.error('Ошибка при получении данных:', error);
      res.status(500).json({ message: 'Ошибка получения данных' });
   }
};

const math = create(all);

export const getForecast = async (req, res) => {
   try {
      // 1. Загружаем всех пациентов с историей болезней
      const patients = await PatientCard.find({}, { diseasesHistory: 1 });

      // 2. Группируем заболеваемость по месяцам
      const diseaseMonthlyCases = {};

      patients.forEach((patient) => {
         patient.diseasesHistory.forEach((record) => {
            const diagnosisDate = new Date(record.diagnosisDate);
            const yearMonth = `${diagnosisDate.getFullYear()}-${String(diagnosisDate.getMonth() + 1).padStart(2, '0')}`;

            if (!diseaseMonthlyCases[yearMonth]) {
               diseaseMonthlyCases[yearMonth] = {};
            }

            const diseaseId = record.diseaseId?.$oid || record.diseaseId; // Учитываем формат ObjectId
            if (!diseaseMonthlyCases[yearMonth][diseaseId]) {
               diseaseMonthlyCases[yearMonth][diseaseId] = 0;
            }

            diseaseMonthlyCases[yearMonth][diseaseId]++;
         });
      });

      // 3. Получаем список всех заболеваний с флагом isEmergency
      const diseases = await Disease.find(
         { isEmergency: true },
         { _id: 1, diseaseCode: 1, diseaseName: 1 },
      );

      // 4. Генерируем список последних 12 месяцев
      const getLast12Months = () => {
         const months = [];
         const today = new Date();
         for (let i = 0; i < 12; i++) {
            const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
            months.unshift(
               `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
            );
         }
         return months;
      };

      const last12Months = getLast12Months();

      // 5. Применяем линейную регрессию для прогноза на 6 месяцев вперед
      const predictNextMonths = (cases) => {
         const n = cases.length;
         const x = Array.from({ length: n }, (_, i) => i + 1); // x = [1, 2, 3, ..., n]
         const y = cases;

         if (y.every((val) => val === 0)) {
            return new Array(6).fill(0); // Если данных нет, прогнозируем 0
         }

         const xSum = math.sum(x);
         const ySum = math.sum(y);
         const xySum = math.sum(x.map((xi, idx) => xi * y[idx]));
         const xSquaredSum = math.sum(x.map((xi) => xi * xi));

         // Вычисляем коэффициенты регрессии: y = a + bx
         const b = (n * xySum - xSum * ySum) / (n * xSquaredSum - xSum * xSum);
         const a = (ySum - b * xSum) / n;

         // Прогнозируем на следующие 6 месяцев
         const nextMonths = [];
         for (let i = n + 1; i <= n + 6; i++) {
            nextMonths.push(Math.max(0, Math.round(a + b * i))); // Прогнозируемые значения
         }

         return nextMonths;
      };

      // 6. Создаем прогноз для заболеваний
      const forecast = diseases.map((disease) => {
         // Исторические данные
         const diseaseCases = last12Months.map(
            (month) => diseaseMonthlyCases[month]?.[disease._id] || 0,
         );

         // Генерируем прогноз на 6 месяцев вперед
         const predictedCases = predictNextMonths(diseaseCases);

         return {
            diseaseCode: disease.diseaseCode,
            diseaseName: disease.diseaseName,
            historicalData: diseaseCases,
            forecast: predictedCases,
         };
      });

      // 7. Сортируем заболевания по количеству случаев и оставляем только 10 самых частых
      const sortedForecast = forecast
         .sort(
            (a, b) =>
               b.historicalData.reduce((sum, value) => sum + value, 0) -
               a.historicalData.reduce((sum, value) => sum + value, 0),
         )
         .slice(0, 10);

      res.json(sortedForecast);
   } catch (error) {
      console.error('Ошибка при получении прогноза:', error);
      res.status(500).json({ error: 'Ошибка сервера' });
   }
};
