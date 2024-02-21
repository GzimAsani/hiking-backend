import { time } from "console";
import mongoose from "mongoose";

const Reminder = new mongoose.Schema({
    date: {
        type: String,
        created: Date,
        required: true
    },
    time: {
        type: String,
        created: time,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});

const ReminderModel = mongoose.model("Reminder", Reminder);

export default ReminderModel;
