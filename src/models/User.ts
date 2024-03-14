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
  },
  profileImg: {
    type: String,
    default: null,
  },
  age: {
    type: Number,
    min: [1, 'Age cannot be less than 1'],
    max: [150, 'Age cannot be greater than 150'],
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
  },
  location: {
    type: String,
  },
  availability: {
    type: String,
  },
  skillLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
  },
  interests: [String],
  phoneNumber: {
    type: String,
  },
  socialMedia: {
    facebook: String,
    twitter: String,
    instagram: String,
  },
  equipment: [String],
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
  }]
});

const UserModel = mongoose.model('User', User);

export default UserModel;
