import models from '../models';
import utils from '../utils';

const { helper, validator } = utils;

class ReviewController {
  static async addReview(data, authStatus) {
    const newData = data;
    const errors = validator.validateAddReview({
      ...newData
    });
    try {
      if (!authStatus) {
        throw new Error('Permission denied, you need to signup/login');
      }
      const book = await models.Book.find({
        where: {
          id: newData.bookId
        }
      });
      newData.id = helper.generateId();
      newData.userId = authStatus.id;
      if (Object.keys(errors).length !== 0) {
        throw new Error(JSON.stringify(errors));
      }
      return book && await models.Review.create(newData);
    } catch (error) {
      return error;
    }
  }

  static async getReview(reviewId) {
    try {
      return await models.Review.findById(reviewId);
    } catch (error) {
      return error;
    }
  }

  static async retrieveReviews(bookId) {
    const Users = models.User;
    try {
      const reviews = await models.Review.findAll({
        where: {
          bookId
        },
        include: [{
          model: Users,
          as: 'reviewer',
          attributes: ['username']
        }]
      });
      if (reviews.length === 0) throw new Error('No reviews found');
      return reviews;
    } catch (error) {
      return error;
    }
  }

  static async getBookReviews(bookId) {
    try {
      const reviews = await ReviewController.retrieveReviews(bookId);
      return await ReviewController.flattenFetchedReviews(reviews);
    } catch (error) {
      return error;
    }
  }

  static async flattenFetchedReviews(reviews) {
    try {
      const newReviews = reviews.length && reviews.map(review => ({
        id: review.id,
        review: review.review,
        rating: review.rating,
        reviewer: review.reviewer.username
      }));
      return newReviews;
    } catch (error) {
      return error;
    }
  }

  static async getAverageRating(bookId) {
    const reviews = await ReviewController.retrieveReviews(bookId);
    const totalReviews = reviews.length;
    const averageRating = totalReviews
      && reviews
        .reduce((totalRating, value) => totalRating + value.rating, 0)
        / totalReviews;
    return averageRating || 0;
  }
}

export default ReviewController;
