import {
  usernameRequired, minimumPasswordLength, invalidEmailMessage,
  passwordPatternMessage, bookNameRequired, genreIsRequired,
  publishedYearRequired, bookAuthorRequired, bookIdRequired, reviewRequired,
  ratingRequired, ratingSizeMessage, replyRequired, reviewIdRequired
} from './default';

class Validator {
  static validateData(data) {
    const { username, password } = data;
    const validationError = {};
    const pattern = /^[A-Za-z0-9!@#$%^&*()_]{6,20}$/;
    try {
      if (!username || !username.trim()) {
        validationError.username = usernameRequired;
      }
      if (!password || !password.trim() || password.length < 6) {
        validationError.password = minimumPasswordLength;
      }
      if (!pattern.test(password)) {
        validationError
          .password = passwordPatternMessage;
      }
      throw validationError;
    } catch (error) {
      return error;
    }
  }

  static validateEmail(data) {
    const { email } = data;
    const validationError = {};
    const pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // eslint-disable-line
    try {
      if (!email || !email.trim() || !pattern.test(email)) {
        validationError.email = invalidEmailMessage;
      }
      throw validationError;
    } catch (error) {
      return error;
    }
  }

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

  static validateAddBook(data) {
    const {
      name, author, genre, year
    } = data;
    const validationError = {};
    try {
      if (!name || !name.trim()) validationError.name = bookNameRequired;
      if (!genre.length) validationError.genre = genreIsRequired;
      if (!year || !year.trim()) {
        validationError.year = publishedYearRequired;
      }
      if (!author.length) {
        validationError.author = bookAuthorRequired;
      }
      throw validationError;
    } catch (error) {
      return error;
    }
  }

  static validateAddReview(data) {
    const {
      bookId, review, rating
    } = data;
    const validationError = {};
    try {
      if (!bookId || !bookId.trim()) {
        validationError.bookId = bookIdRequired;
      }
      if (!review || !review.trim()) {
        validationError.review = reviewRequired;
      }
      if (!rating || !rating.trim()) {
        validationError.rating = ratingRequired;
      }
      if (rating >= 5.0) {
        validationError.rating = ratingSizeMessage;
      }
      throw validationError;
    } catch (error) {
      return error;
    }
  }

  static validateAddReply(data) {
    const {
      reviewId, reply
    } = data;
    const validationError = {};
    try {
      if (!reviewId || !reviewId.trim()) {
        validationError.reviewId = reviewIdRequired;
      }
      if (!reply || !reply.trim()) {
        validationError.reply = replyRequired;
      }
      throw validationError;
    } catch (error) {
      return error;
    }
  }
}

export default Validator;
