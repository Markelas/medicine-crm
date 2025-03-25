import mongoose from 'mongoose';

const VaccinationRecordSchema = new mongoose.Schema(
   {
      patientId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'PatientCard',
         required: true,
      },
      vaccineId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Vaccine',
         required: true,
      },
      vaccinationDate: {
         type: Date,
         required: true,
      },
      boosterDate: {
         type: Date, // Дата ревакцинации (если есть)
      },
      healthcareProvider: {
         type: String, // Название медицинского учреждения
      },
   },
   { timestamps: true },
);

export default mongoose.model('VaccinationRecord', VaccinationRecordSchema);
