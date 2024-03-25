import mongoose from "mongoose";
import ImageSchema from "./image.model";

const Blogs = new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
    },
    images: {
        type: [ImageSchema]
    },
    seenCount: {
        type: Number,
        default: 0
    }

});

const BlogsModel = mongoose.model("Blogs", Blogs);

export default BlogsModel;
