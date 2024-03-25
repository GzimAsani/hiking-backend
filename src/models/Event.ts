import mongoose from "mongoose";
import TrailModel from "./Trail";
import UserModel from "./User";

const Event = new mongoose.Schema({
  trail: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Trail",
    required: true,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  attendees: [
    {
      _id: String,
      firstName: String,
      lastName: String,
    }
  ],
  date: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
  },
  duration: {
    type: Number,
  },
  maxAttendees: {
    type: Number,
  },
  status: {
    type: String,
    enum: ["active", "canceled", "completed"],
    default: "active",
  },
  title: {
    type: String,
  },
  description: {
    type: String,
  },
});

Event.pre("save", async function (next) {
  if (this.isNew) {
    const trail = await TrailModel.findById(this.trail);
    const user = await UserModel.findById(this.creator._id);

    if (trail) {
      this.duration = trail.duration;
    }

    this.attendees.push({
      _id: user?._id,
      firstName: user?.firstName,
      lastName: user?.lastName,
    });
  }
  next();
});

const EventModel = mongoose.model("Event", Event);

export default EventModel;
