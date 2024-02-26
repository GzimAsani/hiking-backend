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
    description: {
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    joinedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }]
});

const ReminderModel = mongoose.model("Reminder", Reminder);

export default ReminderModel;
