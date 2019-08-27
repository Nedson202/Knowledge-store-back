import {
  USERNAME_REQUIRED, MINIMUM_PASSWORD_LENGTH, INVALID_EMAIL_MESSAGE,
  PASSWORD_PATTERN_MESSAGE, BOOK_NAME_REQUIRED, GENRE_REQUIRED,
  YEAR_PUBLISHED_REQUIRED, BOOK_AUTHOR_REQUIRED, BOOK_ID_REQUIRED, REVIEW_REQUIRED,
  RATING_REQUIRED, INVALID_RATING, REPLY_REQUIRED, REVIEW_ID_REQUIRED
} from '../settings/default';

class Validator {
  /**
   *
   *
   * @static
   * @param {*} data
   * @returns
   * @memberof Validator
   */
  static validateData(data) {
    const { username, password } = data;
    const validationError = {};
    const pattern = /^[A-Za-z0-9!@#$%^&*()_]{6,20}$/;
    try {
      if (!username || !username.trim()) {
        validationError.username = USERNAME_REQUIRED;
      }
      if (!password || !password.trim() || password.length < 6) {
        validationError.password = MINIMUM_PASSWORD_LENGTH;
      }
      if (!pattern.test(password)) {
        validationError
          .password = PASSWORD_PATTERN_MESSAGE;
      }
      throw validationError;
    } catch (error) {
      return error;
    }
  }

  /**
   *
   *
   * @static
   * @param {*} data
   * @returns
   * @memberof Validator
   */
  static validateEmail(data) {
    const { email } = data;
    const validationError = {};
    const pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // eslint-disable-line
    try {
      if (!email || !email.trim() || !pattern.test(email)) {
        validationError.email = INVALID_EMAIL_MESSAGE;
      }
      throw validationError;
    } catch (error) {
      return error;
    }
  }

  /**
   *
   *
   * @static
   * @param {*} data
   * @returns
   * @memberof Validator
   */
  static validateSignup(data) {
    try {
      let validationError = {};
      const datavalidationError = Validator.validateData(data);
      const emailvalidationError = Validator.validateEmail(data);
      validationError = { ...datavalidationError, ...emailvalidationError };
      throw validationError;
    } catch (error) {
      return error;
    }
  }

  /**
   *
   *
   * @static
   * @param {*} data
   * @returns
   * @memberof Validator
   */
  static validateAddBook(data) {
    const {
      name, author, genre, year
    } = data;
    const validationError = {};
    try {
      if (!name || !name.trim()) validationError.name = BOOK_NAME_REQUIRED;
      if (!genre.length) validationError.genre = GENRE_REQUIRED;
      if (!year || !year.trim()) {
        validationError.year = YEAR_PUBLISHED_REQUIRED;
      }
      if (!author.length) {
        validationError.author = BOOK_AUTHOR_REQUIRED;
      }
      throw validationError;
    } catch (error) {
      return error;
    }
  }

  /**
   *
   *
   * @static
   * @param {*} data
   * @returns
   * @memberof Validator
   */
  static validateAddReview(data) {
    const {
      bookId, review, rating
    } = data;
    const validationError = {};
    try {
      if (!bookId || !bookId.trim()) {
        validationError.bookId = BOOK_ID_REQUIRED;
      }
      if (!review || !review.trim()) {
        validationError.review = REVIEW_REQUIRED;
      }
      if (!rating || !rating.trim()) {
        validationError.rating = RATING_REQUIRED;
      }
      if (rating >= 5.0) {
        validationError.rating = INVALID_RATING;
      }
      throw validationError;
    } catch (error) {
      return error;
    }
  }

  /**
   *
   *
   * @static
   * @param {*} data
   * @returns
   * @memberof Validator
   */
  static validateAddReply(data) {
    const {
      reviewId, reply
    } = data;
    const validationError = {};
    try {
      if (!reviewId || !reviewId.trim()) {
        validationError.reviewId = REVIEW_ID_REQUIRED;
      }
      if (!reply || !reply.trim()) {
        validationError.reply = REPLY_REQUIRED;
      }
      throw validationError;
    } catch (error) {
      return error;
    }
  }
}

export default Validator;
