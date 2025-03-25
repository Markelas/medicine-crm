import mongoose from 'mongoose';

const DiseaseRecordSchema = new mongoose.Schema({
   diseaseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Disease', // Ссылка на справочник болезней
      required: true,
   },
   diagnosisDate: {
      type: Date,
      required: true, // Дата постановки диагноза
   },
   recoveryDate: {
      type: Date, // Дата выздоровления (если есть)
   },
   symptoms: {
      type: String, // Симптомы заболевания
   },
   treatment: {
      type: String, // Лечение (если необходимо)
   },
   notes: {
      type: String, // Дополнительные заметки врача
   },
});
const PatientCardSchema = new mongoose.Schema(
   {
      patientId: { type: Number, required: true, unique: true },
      fullName: { type: String, required: true },
      gender: { type: String, enum: ['Male', 'Female'], required: true },
      dateOfBirth: { type: Date, required: true },
      diseasesHistory: [DiseaseRecordSchema], // История болезней пациента
      vaccinationHistory: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'VaccinationRecord', // Список прививок пациента
         },
      ],
      profession: { type: String, required: true },
      workplace: { type: String, required: true },
      homeAddress: { type: String, required: true },
      passportData: { type: String, required: true },
      medicalInstitution: { type: String, required: true },
   },
   { timestamps: true },
);

export default mongoose.model('PatientCard', PatientCardSchema);
