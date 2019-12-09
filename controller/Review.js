import { loggerInstance as logger } from '../logger';

import Utils from '../utils';
import validator from '../utils/validator';
import { esInstance as elasticSearch } from '../elasticSearch';
import Book from './Book';
import {
  NO_REVIEW, NO_BOOK_FOUND,
} from '../settings';
import { redisInstance as redis } from '../redis';
import authStatusCheck from '../utils/authStatusCheck';
import ReviewRepository from '../repository/Review';
import LikeRepository from '../repository/Like';

const reviewRepository = new ReviewRepository();
const likeRepository = new LikeRepository();

class Review {
  /**
   *
   *
   * @static
   * @param {*} data
   * @param {*} authStatus
   * @returns
   * @memberof Review
   */
  static async addReview(data, authStatus) {
    authStatusCheck(authStatus);

    const newData = data;
    const { isValid, errors } = validator.validateAddReview({
      ...newData
    });

    if (!isValid) {
      throw new Error(JSON.stringify(errors));
    }

    try {
      let retrievedBook;

      const { bookId } = newData;

      const redisKey = JSON.stringify(bookId);
      retrievedBook = await redis.getDataFromRedis(redisKey) || {};
      if (!retrievedBook) {
        retrievedBook = await elasticSearch.retrieveBook(newData.bookId);
      }

      if (retrievedBook) await Book.addBookIfNotExist(retrievedBook, newData.bookId);
      if (!retrievedBook) {
        retrievedBook = await Book.getBook(bookId);
      }
      if (!retrievedBook) throw new Error(NO_BOOK_FOUND);
      if (retrievedBook.userId === authStatus.id) {
        throw new Error('You can not review your book');
      }

      newData.id = Utils.generateId();
      newData.userId = authStatus.id;

      return retrievedBook && await reviewRepository.create(newData);
    } catch (error) {
      logger.stackLogger(error);
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
   * @memberof Review
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
      logger.stackLogger(error);
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
   * @memberof Review
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
      logger.stackLogger(error);
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
   * @memberof Review
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
   * @memberof Review
   */
  static async getReview(reviewId) {
    try {
      return await reviewRepository.findOne({
        id: reviewId
      });
    } catch (error) {
      logger.stackLogger(error);
      return error;
    }
  }

  /**
   *
   *
   * @static
   * @param {*} bookId
   * @returns
   * @memberof Review
   */
  static async retrieveReviewsQuery(bookId) {
    try {
      const reviews = await reviewRepository.getAll({
        bookId
      });

      return !reviews.length ? [] : reviews;
    } catch (error) {
      logger.stackLogger(error);
      return error;
    }
  }

  /**
   *
   *
   * @static
   * @param {*} bookId
   * @returns
   * @memberof Review
   */
  static async getBookReviews(bookId) {
    try {
      const reviews = await Review.retrieveReviewsQuery(bookId);

      return Review.flattenFetchedReviews(reviews);
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
   * @memberof Review
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
   * @memberof Review
   */
  static async getAverageRating(bookId) {
    const averageRating = await reviewRepository.getAverageRating(bookId);

    return averageRating;
  }
}

export default Review;
