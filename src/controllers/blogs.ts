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

    async deleteBlog(blogId: any, authorId: any) {
        try {
            const blog = await BlogsModel.findById(blogId);
            if (!blog) {
                const customError: any = new Error('Event not found');
                customError.code = HTTP_CODE.NotFound;
                throw customError;
            }

            if (blog.author.toString() !== authorId.toString()) {
                const customError: any = new Error('You are not the author of this blog and so you cannot delete it!');
                customError.code = HTTP_CODE.Forbidden;
                throw customError;
            }
            await BlogsModel.findByIdAndDelete(blogId);
            return { message: 'Event deleted successfully' };
        } catch (error) {
            console.error('Error deleting event:', error);
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