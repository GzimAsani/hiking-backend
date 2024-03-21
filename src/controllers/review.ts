import ReviewsModel from "../models/Review";

export class ReviewController{
    async getReviews() {
        try {
            const reviews = await ReviewsModel.find();
            return reviews;
        } catch (error) {
            console.error('Error:', error);
            throw new Error('Internal Server Error');
        }
    }

    async getReviewById(reviewId: string) {
        try {
            const review = await ReviewsModel.findById(reviewId);
            return review;
        } catch (error) {
            console.error('Error:', error);
            throw new Error('Internal Server Error');
        }
    }

    async saveReview(reviewData: any){
        try {
            const newReview = await ReviewsModel.create(reviewData);
            return newReview;
        } catch (error) {
            console.error('Error:', error);
            throw new Error('Internal Server Error');
        }
    }

    async deleteReview(reviewId: string, authorId: string){
        try{
            const deleteReview = await ReviewsModel.findOneAndDelete({_id: reviewId, author: authorId});
            if(!deleteReview) {
                throw new Error('Review not found or you are not authorized to delete this review');
            }
            return deleteReview;
        } catch(error){
            console.error('Error:', error);
            throw new Error('Internal Server Error');
        }
    }

    async updateReview(reviewId: string, updatedReview: any){
        try {
            const updateReview = await ReviewsModel.findByIdAndUpdate(reviewId, updatedReview, { new: true });
            if (!updateReview) {
                throw new Error('Review not found');
            }
            return updateReview;
        } catch (error) {
            console.error('Error:', error);
            throw new Error('Internal Server Error');
        }
    }
}