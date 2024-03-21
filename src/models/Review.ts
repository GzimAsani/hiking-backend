import mongoose from "mongoose";

const Reviews = new mongoose.Schema({
    rating: {
        type: Number,
        required: true
    },
    trail: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trail',
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    date: {
        type: Date,
    },

});

const ReviewsModel = mongoose.model("Reviews", Reviews);

export default ReviewsModel;
