import mongoose from 'mongoose';

const EmergencyNotificationSchema = new mongoose.Schema(
   {
      notificationId: {
         type: String,
         required: true,
         unique: true,
      },
      patientId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'PatientCard', // Связь с картой пациента
         required: true,
      },
      notificationDate: {
         type: Date,
         required: true,
      },
      diseaseCode: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Disease', // Связь с заболеванием
         required: true,
      },
      residence: {
         type: String,
         required: true,
      },
      medicalInstitution: {
         type: String,
         required: true,
      },
   },
   { timestamps: true },
);

export default mongoose.model(
   'EmergencyNotification',
   EmergencyNotificationSchema,
);
