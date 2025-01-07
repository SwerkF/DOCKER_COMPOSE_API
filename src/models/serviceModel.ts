import mongoose, { Schema, Document } from 'mongoose';

export interface IService extends Document {
    name: string;
    description: string;
    duration: string;
    price?: number;
    isActive: boolean;
    users: mongoose.Schema.Types.ObjectId[]; // Liste des utilisateurs habilités à effectuer ce service
    createdAt: Date;
    updatedAt: Date;
  }
  
  const serviceSchema: Schema<IService> = new Schema(
    {
      name: { type: String, required: true, trim: true },
      description: { type: String, required: true, trim: true },
      duration: { type: String, required: true },
      price: { type: Number },
      isActive: { type: Boolean, default: true },
      users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Relation vers les utilisateurs
    },
    { timestamps: true }
  );
  
  export const Service = mongoose.model<IService>('Service', serviceSchema);
  