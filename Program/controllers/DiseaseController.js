// Получить все заболевания
import Disease from '../models/Disease.js';

// Получить все заболевания с пагинацией и поиском
export const getAllDiseases = async (req, res) => {
   try {
      const {
         search = '',
         page = 1,
         limit = 30,
         noPagination = false,
      } = req.query;

      // Если не указано, что пагинация не требуется, применяем пагинацию
      const skip = !noPagination ? (page - 1) * limit : 0;

      // Строим запрос с фильтрацией по имени болезни или коду
      const diseases = await Disease.find({
         $or: [
            { diseaseCode: { $regex: search, $options: 'i' } },
            { diseaseName: { $regex: search, $options: 'i' } },
         ],
      })
         .skip(skip) // Пропускаем записи для пагинации, если это нужно
         .limit(noPagination ? 0 : limit); // Если пагинация не нужна, не ограничиваем количество записей

      // Если пагинация нужна, получаем общее количество заболеваний
      const totalDiseases = !noPagination
         ? await Disease.countDocuments({
              $or: [
                 { diseaseCode: { $regex: search, $options: 'i' } },
                 { diseaseName: { $regex: search, $options: 'i' } },
              ],
           })
         : diseases.length;

      // Возвращаем данные с пагинацией и количеством
      res.json({
         diseases,
         totalDiseases,
         currentPage: page,
         totalPages: Math.ceil(totalDiseases / limit),
      });
   } catch (err) {
      console.error(err);
      res.status(500).json({
         message: 'Не удалось получить список заболеваний',
      });
   }
};

// Другие контроллеры остаются без изменений

// Получить заболевание по коду
export const getDiseaseByCode = async (req, res) => {
   try {
      const diseaseId = req.params.code;
      const disease = await Disease.findById(diseaseId);

      if (!disease) {
         return res.status(404).json({
            message: 'Заболевание не найдено',
         });
      }

      res.json(disease);
   } catch (err) {
      console.error(err);
      res.status(500).json({
         message: 'Не удалось получить заболевание',
      });
   }
};

// Создать запись заболевания
export const createDisease = async (req, res) => {
   try {
      const { diseaseCode, diseaseName, epidThreshold, isEmergency } = req.body;

      // Проверка обязательных полей
      if (!diseaseCode || !diseaseName || typeof epidThreshold !== 'number') {
         return res.status(400).json({
            message: 'Все поля, включая порог случаев, должны быть заполнены',
         });
      }

      const doc = new Disease({
         diseaseCode,
         diseaseName,
         epidThreshold, // Добавлено поле порога случаев
         isEmergency: isEmergency || false, // Если значение не передано, устанавливаем по умолчанию false
      });

      const disease = await doc.save();
      res.json(disease); // Возвращаем созданное заболевание
   } catch (err) {
      console.error(err);
      res.status(500).json({
         message: 'Не удалось создать запись заболевания',
      });
   }
};

// Обновить запись заболевания
export const updateDisease = async (req, res) => {
   try {
      const diseaseCode = req.params.code;

      const updated = await Disease.updateOne(
         { diseaseCode },
         { diseaseName: req.body.diseaseName },
      );

      if (updated.modifiedCount === 0) {
         return res.status(404).json({
            message: 'Заболевание не найдено',
         });
      }

      res.json({ success: true });
   } catch (err) {
      console.error(err);
      res.status(500).json({
         message: 'Не удалось обновить запись заболевания',
      });
   }
};

// Удалить запись заболевания
export const deleteDisease = async (req, res) => {
   try {
      const diseaseId = req.params.code;

      const deleted = await Disease.findByIdAndDelete(diseaseId);

      if (!deleted) {
         return res.status(404).json({
            message: 'Заболевание не найдено',
         });
      }

      res.json({ success: true });
   } catch (err) {
      console.error(err);
      res.status(500).json({
         message: 'Не удалось удалить запись заболевания',
      });
   }
};
