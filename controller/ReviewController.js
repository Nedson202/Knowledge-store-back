import { stackLogger } from 'info-logger';

import Utils from '../utils';
import validator from '../utils/validator';
import { retrieveBook } from '../elasticSearch';
import BookController from './BookController';
import {
  NO_REVIEW, NO_BOOK_FOUND,
} from '../settings';
import { getDataFromRedis } from '../redis';
import authStatusCheck from '../utils/authStatusCheck';
import ReviewRepository from '../repository/Review';
import LikeRepository from '../repository/Like';

const reviewRepository = new ReviewRepository();
const likeRepository = new LikeRepository();

class ReviewController {
  /**
   *
   *
   * @static
   * @param {*} data
   * @param {*} authStatus
   * @returns
   * @memberof ReviewController
   */
  static async addReview(data, authStatus) {
    authStatusCheck(authStatus);

    const newData = data;
    const errors = validator.validateAddReview({
      ...newData
    });
    try {
      let retrievedBook;

      const { bookId } = newData;

      const redisKey = JSON.stringify(bookId);
      retrievedBook = await getDataFromRedis(redisKey) || {};
      if (!retrievedBook) {
        retrievedBook = await retrieveBook(newData.bookId);
      }

      if (retrievedBook) await BookController.addBookIfNotExist(retrievedBook, newData.bookId);
      if (!retrievedBook) {
        retrievedBook = await BookController.getBook(bookId);
      }
      if (!retrievedBook) throw new Error(NO_BOOK_FOUND);
      if (retrievedBook.userId === authStatus.id) {
        throw new Error('You can not review your book');
      }

      newData.id = Utils.generateId();
      newData.userId = authStatus.id;

      if (Object.keys(errors).length !== 0) {
        throw new Error(JSON.stringify(errors));
      }

      return retrievedBook && await reviewRepository.create(newData);
    } catch (error) {
      stackLogger(error);
      return error;
    }
  }

  /**
   *
   *
   * @static
   * @param {*} data
   * @param {*} authStatus
   * @returns
   * @memberof ReviewController
   */
  static async editReview(data, authStatus) {
    authStatusCheck(authStatus);

    const {
      review, rating, reviewId,
    } = data;
    const editObject = {
      review,
      rating
    };
    try {
      const editedReview = await reviewRepository.updateOne({
        id: reviewId,
        userId: authStatus.id
      }, editObject);

      if (!editedReview) throw new Error(NO_REVIEW);

      return editedReview;
    } catch (error) {
      stackLogger(error);
      return error;
    }
  }

  /**
   *
   *
   * @static
   * @param {*} data
   * @param {*} authStatus
   * @returns
   * @memberof ReviewController
   */
  static async toggleLikeOnReview(data, authStatus) {
    authStatusCheck(authStatus);

    const {
      reviewId,
    } = data;
    try {
      await likeRepository.toggleLike({
        reviewId
      }, authStatus.id);
    } catch (error) {
      stackLogger(error);
      return error;
    }
  }

  /**
   *
   *
   * @static
   * @param {*} data
   * @param {*} authStatus
   * @returns
   * @memberof ReviewController
   */
  static async deleteReview(data, authStatus) {
    authStatusCheck(authStatus);

    const { reviewId } = data;
    try {
      const deletedReview = await reviewRepository.deleteOne({
        id: reviewId,
        userId: authStatus.id
      });

      if (!deletedReview) throw new Error(NO_REVIEW);

      return deletedReview;
    } catch (error) {
      return error;
    }
  }

  /**
   *
   *
   * @static
   * @param {*} reviewId
   * @returns
   * @memberof ReviewController
   */
  static async getReview(reviewId) {
    try {
      return await reviewRepository.findOne({
        id: reviewId
      });
    } catch (error) {
      stackLogger(error);
      return error;
    }
  }

  /**
   *
   *
   * @static
   * @param {*} bookId
   * @returns
   * @memberof ReviewController
   */
  static async retrieveReviewsQuery(bookId) {
    try {
      const reviews = await reviewRepository.getAll({
        bookId
      });

      return !reviews.length ? [] : reviews;
    } catch (error) {
      stackLogger(error);
      return error;
    }
  }

  /**
   *
   *
   * @static
   * @param {*} bookId
   * @returns
   * @memberof ReviewController
   */
  static async getBookReviews(bookId) {
    try {
      const reviews = await ReviewController.retrieveReviewsQuery(bookId);

      return ReviewController.flattenFetchedReviews(reviews);
    } catch (error) {
      return error;
    }
  }

  /**
   *
   *
   * @static
   * @param {*} reviews
   * @returns
   * @memberof ReviewController
   */
  static flattenFetchedReviews(reviews) {
    try {
      const newReviews = reviews.map(review => ({
        id: review.id,
        review: review.review,
        rating: review.rating,
        userId: review.userId,
        bookId: review.bookId,
        reviewer: review.username,
        picture: review.picture || '',
        avatarColor: review.avatarColor,
        likes: review.likes,
        reviewsLikedBy: review.users || '',
        createdAt: review.createdAt,
        updatedAt: review.updatedAt,
      }));

      return newReviews || [];
    } catch (error) {
      return error;
    }
  }

  /**
   *
   *
   * @static
   * @param {*} bookId
   * @returns
   * @memberof ReviewController
   */
  static async getAverageRating(bookId) {
    const averageRating = await reviewRepository.getAverageRating(bookId);

    return averageRating;
  }
}

export default ReviewController;
