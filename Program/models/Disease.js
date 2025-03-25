import mongoose from 'mongoose';

const DiseaseSchema = new mongoose.Schema(
   {
      diseaseCode: { type: String, required: true, unique: true },
      diseaseName: { type: String, required: true },
      epidThreshold: { type: Number }, // Порог случаев
      isEmergency: { type: Boolean, default: false }, // Опасные болезни
   },
   { timestamps: true },
);

export default mongoose.model('Disease', DiseaseSchema);
