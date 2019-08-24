import { stackLogger } from 'info-logger';
import models from '../models';
import utils from '../utils';
import { retrieveBook } from '../elasticSearch/elasticSearch';
import BookController from './BookController';
import {
  authStatusPermission, noReview, userAttributes, reviewerLabel,
  noBookFound, descOrder
} from '../utils/default';

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
      if (!authStatus) {
        throw new Error(authStatusPermission);
      }
      retrievedBook = await retrieveBook(newData.bookId);

      if (retrievedBook) await BookController.addBookIfNotExist(retrievedBook);
      if (!retrievedBook) {
        retrievedBook = await BookController.getBook(newData.bookId);
      }
      if (!retrievedBook) throw new Error(noBookFound);
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
    try {
      if (!authStatus) {
        throw new Error(authStatusPermission);
      }
      const editedReview = await models.Review.update(
        {
          review, rating, likes: models.sequelize.literal(`likes + ${like}`), liked: true
        },
        {
          returning: true,
          where: {
            id: reviewId,
            userId: authStatus.id
          }
        }
      );
      if (!editedReview) throw new Error(noReview);
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
      if (!authStatus) {
        throw new Error(authStatusPermission);
      }
      const deletedReview = await models.Review.destroy(
        {
          returning: true,
          where: {
            id: reviewId,
            userId: authStatus.id
          }
        }
      );
      if (!deletedReview) throw new Error(noReview);
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
          as: reviewerLabel,
          attributes: userAttributes
        }],
        order: [descOrder],
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
