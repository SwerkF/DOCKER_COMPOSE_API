import mongoose, { Schema, Document } from 'mongoose';

export interface IWorkingHour extends Document {
  userId: mongoose.Schema.Types.ObjectId; // Référence à un utilisateur
  startTime: string; // Format HH:mm
  endTime: string; // Format HH:mm
  day?: string; // Pour les horaires récurrents (ex. "Monday")
  date?: Date; // Pour les horaires exceptionnels
  isRecurring: boolean; // Horaires récurrents ou exceptionnels
  priority?: boolean; // Priorité des horaires exceptionnels
  createdAt: Date;
  updatedAt: Date;
}

const workingHourSchema: Schema<IWorkingHour> = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    day: { type: String, trim: true },
    date: { type: Date },
    isRecurring: { type: Boolean, required: true },
    priority: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const WorkingHour = mongoose.model<IWorkingHour>('WorkingHour', workingHourSchema);
