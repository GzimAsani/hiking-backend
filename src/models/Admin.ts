import mongoose, { Document, Schema } from 'mongoose';

interface Admin extends Document {
  username: string;
  email: string;
  password: string;
}

const adminSchema = new Schema<Admin>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

export default mongoose.model<Admin>('Admin', adminSchema);