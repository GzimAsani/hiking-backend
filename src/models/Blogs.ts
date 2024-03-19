import mongoose from "mongoose";

const Blogs = new mongoose.Schema({
    date: {
        type: Date,
        created: Date,
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
        type: Image,
    }

});

const BlogsModel = mongoose.model("Blogs", Blogs);

export default BlogsModel;
