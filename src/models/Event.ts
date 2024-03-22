import mongoose from "mongoose";
import TrailModel from "./Trail";

const Event = new mongoose.Schema({
  trail: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trail',
    required: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  attendees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  attendeeNames: [{
    type: String
  }],
  date: {
    type: Date,
    required: true
  },
  // time: {
  //   type: Date,
  //   required: true
  // },
  location: {
    type: String
  },
  duration: {
    type: Number
  },
  maxAttendees: {
    type: Number
  },
  status: {
    type: String,
    enum: ['active', 'canceled', 'completed'],
    default: 'active'
  },
  title: {
    type: String
  },
  description: {
    type: String
  }
});

Event.pre('save', async function (next) {
  if (this.isNew) {
    const trail = await TrailModel.findById(this.trail);
    if (trail) {
      this.duration = trail.duration;
    }
    this.attendees.push(this.creator);
  }
  next();
});

const EventModel = mongoose.model("Event", Event);

export default EventModel;
