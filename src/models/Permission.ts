import mongoose, { Document, Schema } from 'mongoose';

// Define the interface for the Permission document
interface IPermission extends Document {
  name: string;
}

// Define the schema for the Permission model
const permissionSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
});

// Create the Permission model
const PermissionModel = mongoose.model<IPermission>('Permission', permissionSchema);

export default PermissionModel;
