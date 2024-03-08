import mongoose from 'mongoose';
const { Schema } = mongoose;

const ImageSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default ImageSchema;
