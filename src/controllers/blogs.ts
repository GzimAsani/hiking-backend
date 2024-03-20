import { HTTP_CODE } from "../enums/http-status-codes";
import BlogsModel from "../models/Blogs";
import TrailModel from "../models/Trail";

export class BlogsController {


    async getBlogs() {
        try {
            const blogs = await BlogsModel.find();
            return blogs;
        } catch (error) {
            console.error('Error:', error);
            throw new Error('Internal Server Error');
        }
    }

    async getBlogById(blogId: string) {
        try {
            const blog = await BlogsModel.findById(blogId);
            return blog;
        } catch (error) {
            console.error('Error:', error);
            throw new Error('Internal Server Error');
        }
    }

    async deleteBlog(blogId: string, authorId: string) {
        try {
            const deletedBlog = await BlogsModel.findOneAndDelete({ _id: blogId, author: authorId });
            if (!deletedBlog) {
                throw new Error('Blog not found or you are not authorized to delete this blog');
            }
            return deletedBlog;
        } catch (error) {
            console.error('Error:', error);
            throw new Error('Internal Server Error');
        }
    }

    async saveBlog(blogData: any) {
        try {
            const newBlog = await BlogsModel.create(blogData);
            return newBlog;
        } catch (error) {
            console.error('Error:', error);
            throw new Error('Internal Server Error');
        }
    }

    async updateBlog(blogId: string, updatedFields: any) {
        try {
            const updatedBlog = await BlogsModel.findByIdAndUpdate(blogId, updatedFields, { new: true });
            if (!updatedBlog) {
                throw new Error('Blog not found');
            }
            return updatedBlog;
        } catch (error) {
            console.error('Error:', error);
            throw new Error('Internal Server Error');
        }
    }

}