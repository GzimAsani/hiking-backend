import mongoose from 'mongoose';
import ImageSchema from './image.model';

const User = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (email: string) => {
        return /\S+@\S+\.\S+/.test(email);
      },
      message: 'Invalid email address',
    },
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: (password: string) => {
        return password.length >= 8;
      },
      message: 'Password must be at least 8 characters long',
    },
  },
  description: {
    type: String,
    default: null
  },
  profileImg: {
    type: ImageSchema,
    // default: null,
  },
  age: {
    type: Number,
    min: [1, 'Age cannot be less than 1'],
    max: [150, 'Age cannot be greater than 150'],
    default: null
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    default: null
  },
  location: {
    type: String,
    default: null
  },
  availability: {
    type: String,
    default: null
  },
  skillLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: null
  },
  interests: {
    type: [String],
    default: null
  },
  phoneNumber: {
    type: String,
    default: null
  },
  socialMedia: {
    facebook: {
      type: String,
      default: null
    },
    twitter: {
      type: String,
      default: null
    },
    instagram: {
      type: String,
      default: null
    },
  },
  equipment: {
    type: [String],
    default: null
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  trailFavorites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trail',
    },
  ],
  hikeBuddy: {
    type: Boolean,
    default: false,
    validate: {
      validator: (value: any) => {
        return typeof value === 'boolean';
      },
      message: 'hikeBuddy must be a boolean value',
    },
  },
  pastTrails: [
    {
      name: String,
      country: String,
      emoji: String,
      date: String,
      notes: String,
      position: {
        lat: String,
        lng: String,
      },
      images: {
        type: [ImageSchema],
      },
    },
  ],
  eventsAttending: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  }],
  reminders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reminder'
  }]
});

const UserModel = mongoose.model('User', User);

export default UserModel;
