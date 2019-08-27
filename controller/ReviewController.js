import { stackLogger } from 'info-logger';
import models from '../models';
import utils from '../utils';
import { retrieveBook } from '../elasticSearch';
import BookController from './BookController';
import {
  NO_REVIEW, USER_QUERY_ATTRIBUTES, REVIEWER_LABEL,
  NO_BOOK_FOUND, DESC_ORDER
} from '../settings/default';
import { getDataFromRedis } from '../redis';
import authStatusCheck from '../utils/authStatusCheck';

const { helper, validator } = utils;

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
    const newData = data;
    const errors = validator.validateAddReview({
      ...newData
    });
    try {
      let retrievedBook;
      authStatusCheck(authStatus);

      const { bookId } = newData;

      const redisKey = JSON.stringify(bookId);
      retrievedBook = await getDataFromRedis(redisKey) || {};
      if (!retrievedBook) {
        retrievedBook = await retrieveBook(newData.bookId);
      }

      if (retrievedBook) await BookController.addBookIfNotExist(retrievedBook);
      if (!retrievedBook) {
        retrievedBook = await BookController.getBook(bookId);
      }
      if (!retrievedBook) throw new Error(NO_BOOK_FOUND);
      if (retrievedBook.userId === authStatus.id) {
        throw new Error('You can not review your book');
      }
      newData.id = helper.generateId();
      newData.userId = authStatus.id;
      if (Object.keys(errors).length !== 0) {
        throw new Error(JSON.stringify(errors));
      }
      return retrievedBook && await models.Review.create(newData);
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
    const {
      review, rating, reviewId, like
    } = data;
    const editObject = {
      review,
      rating
    };
    try {
      authStatusCheck(authStatus);
      if (like) {
        editObject.liked = true;
        editObject.likes = models.sequelize.literal(`likes + ${like}`);
      }
      const editedReview = await models.Review.update(
        editObject,
        {
          returning: true,
          where: {
            id: reviewId,
            userId: authStatus.id
          }
        }
      );
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
  static async deleteReview(data, authStatus) {
    const { reviewId } = data;
    try {
      authStatusCheck(authStatus);
      const deletedReview = await models.Review.destroy(
        {
          returning: true,
          where: {
            id: reviewId,
            userId: authStatus.id
          }
        }
      );
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
      return await models.Review.findOne({
        where: {
          id: reviewId
        },
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
    const Users = models.User;
    try {
      const reviews = await models.Review.findAll({
        where: {
          bookId
        },
        include: [{
          model: Users,
          as: REVIEWER_LABEL,
          attributes: USER_QUERY_ATTRIBUTES
        }],
        order: [DESC_ORDER],
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
      return await ReviewController.flattenFetchedReviews(reviews);
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
  static async flattenFetchedReviews(reviews) {
    try {
      const newReviews = reviews.map(review => ({
        id: review.id,
        review: review.review,
        rating: review.rating,
        userId: review.userId,
        bookId: review.bookId,
        reviewer: review.reviewer.username,
        picture: review.reviewer.picture || '',
        avatarColor: review.reviewer.avatarColor,
        likes: review.likes,
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
    const reviews = await ReviewController.retrieveReviewsQuery(bookId);
    const totalReviews = reviews.length;
    const averageRating = totalReviews
      && reviews
        .reduce((totalRating, value) => totalRating + value.rating, 0)
      / totalReviews;
    return averageRating || 0;
  }
}

export default ReviewController;
