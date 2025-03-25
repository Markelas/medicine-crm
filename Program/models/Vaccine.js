import mongoose from 'mongoose';

const VaccineSchema = new mongoose.Schema(
   {
      vaccineName: {
         type: String,
         required: true,
         unique: true,
      },
      manufacturer: {
         type: String,
      },
      targetDiseases: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Disease', // Болезни, против которых действует вакцина
         },
      ],
      efficacyRate: {
         type: Number, // Эффективность (%) от 0 до 100
         required: true,
      },
      recommendedAge: {
         type: String, // Например: "Дети до 5 лет", "Взрослые старше 60"
      },
   },
   { timestamps: true },
);

export default mongoose.model('Vaccine', VaccineSchema);
