import { time } from "console";
import mongoose from "mongoose";

const Reminder = new mongoose.Schema({
    date: {
        type: Date,
        created: Date,
        required: true
    },
    // time: {
    //     type: String,
    //     created: time,
    //     required: true
    // },
    location: {
        type: String,
    },
    description: {
        type: String,
    }
});

const ReminderModel = mongoose.model("Reminder", Reminder);

export default ReminderModel;
