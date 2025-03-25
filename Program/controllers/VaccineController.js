import Vaccine from '../models/Vaccine.js';

// Получить все вакцины с пагинацией и поиском
export const getAllVaccines = async (req, res) => {
   try {
      // Получаем параметры из запроса: поиск и пагинация
      const { search = '', page = 1, limit = 30 } = req.query;
      const skip = (page - 1) * limit; // Пропуск записей для пагинации

      // Строим запрос с фильтрацией по имени вакцины
      const vaccines = await Vaccine.find({
         vaccineName: { $regex: search, $options: 'i' },
      })
         .skip(skip) // Пропускаем записи для пагинации
         .limit(limit) // Ограничиваем количество записей
         .populate('targetDiseases'); // Подгружаем связанные болезни

      // Получаем общее количество вакцин для пагинации
      const totalVaccines = await Vaccine.countDocuments({
         vaccineName: { $regex: search, $options: 'i' },
      });

      // Возвращаем данные с пагинацией и количеством
      res.json({
         vaccines,
         totalVaccines,
         currentPage: page,
         totalPages: Math.ceil(totalVaccines / limit),
      });
   } catch (err) {
      console.error(err);
      res.status(500).json({
         message: 'Не удалось получить список вакцин',
      });
   }
};

// Получить вакцину по ID
export const getVaccineById = async (req, res) => {
   try {
      const vaccineId = req.params.id;
      const vaccine =
         await Vaccine.findById(vaccineId).populate('targetDiseases');

      if (!vaccine) {
         return res.status(404).json({
            message: 'Вакцина не найдена',
         });
      }

      res.json(vaccine);
   } catch (err) {
      console.error(err);
      res.status(500).json({
         message: 'Не удалось получить вакцину',
      });
   }
};

// Создать запись вакцины
export const createVaccine = async (req, res) => {
   try {
      const {
         vaccineName,
         manufacturer,
         targetDiseases,
         efficacyRate,
         recommendedAge,
      } = req.body;

      const doc = new Vaccine({
         vaccineName,
         manufacturer,
         targetDiseases,
         efficacyRate,
         recommendedAge,
      });

      const vaccine = await doc.save();
      res.json(vaccine);
   } catch (err) {
      console.error(err);
      res.status(500).json({
         message: 'Не удалось создать запись вакцины',
      });
   }
};

// Обновить запись вакцины
export const updateVaccine = async (req, res) => {
   try {
      const vaccineId = req.params.id;

      const updated = await Vaccine.updateOne(
         { _id: vaccineId },
         {
            $set: {
               vaccineName: req.body.vaccineName,
               manufacturer: req.body.manufacturer,
               targetDiseases: req.body.targetDiseases,
               efficacyRate: req.body.efficacyRate,
               recommendedAge: req.body.recommendedAge,
            },
         },
      );

      if (updated.modifiedCount === 0) {
         return res.status(404).json({
            message: 'Вакцина не найдена',
         });
      }

      res.json({ success: true });
   } catch (err) {
      console.error(err);
      res.status(500).json({
         message: 'Не удалось обновить запись вакцины',
      });
   }
};

// Удалить запись вакцины
export const deleteVaccine = async (req, res) => {
   try {
      const vaccineId = req.params.code;

      const deleted = await Vaccine.findByIdAndDelete(vaccineId);

      if (!deleted) {
         return res.status(404).json({
            message: 'Вакцина не найдена',
         });
      }

      res.json({ success: true });
   } catch (err) {
      console.error(err);
      res.status(500).json({
         message: 'Не удалось удалить запись вакцины',
      });
   }
};
