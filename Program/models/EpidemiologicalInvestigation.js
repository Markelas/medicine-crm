import mongoose from 'mongoose';

const EpidemiologicalInvestigationSchema = new mongoose.Schema(
   {
      investigationId: {
         type: Number,
         required: true,
         unique: true,
      },
      notificationId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'EmergencyNotification', // Связь с экстренным извещением
         required: true,
      },
      patientCardId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'PatientCard', // Связь с картой пациента
         required: true,
      },
      diseaseCode: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Disease', // Связь с заболеванием
         required: true,
      },
      casesRegistered: {
         type: Number,
         required: true,
      },
      laboratoryResearch: {
         type: String,
         required: true,
      },
      contactCircle: {
         type: String,
         required: false,
      },
      placeOfOccurrence: {
         type: String,
         required: false,
      },
      sourceOfInfection: {
         type: String,
         required: false,
      },
      infectionRisks: {
         type: String,
         required: false,
      },
   },
   { timestamps: true },
);

export default mongoose.model(
   'EpidemiologicalInvestigation',
   EpidemiologicalInvestigationSchema,
);
