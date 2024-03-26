import mongoose from 'mongoose';

const Reminder = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  reminderDate: {
    type: Date,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

const ReminderModel = mongoose.model('Reminder', Reminder);

export default ReminderModel;
