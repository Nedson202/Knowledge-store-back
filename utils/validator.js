class Validator {
  static validateData(data) {
    const { username, password } = data;
    const validationError = {};
    const pattern = /^[A-Za-z0-9!@#$%^&*()_]{6,10}$/;
    try {
      if (!username || !username.trim()) {
        validationError.username = 'Username is required';
      }
      if (!password || !password.trim() || password.length < 6) {
        validationError.password = 'Minimum password length is 6';
      }
      if (!pattern.test(password)) {
        validationError
          .password = `Password must include lowercase,
          uppercase, and special characters`;
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
        validationError.email = 'Email format is invalid';
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
      if (!name || !name.trim()) validationError.name = 'book name is required';
      if (!genre || !genre.trim()) validationError.genre = 'genre is required';
      if (!year) {
        validationError.year = 'book published year is required';
      }
      if (typeof year !== 'number' || year.toString().length > 4) {
        validationError.year = 'book published year is invalid';
      }
      if (!author || !author.trim()) {
        validationError.author = 'book published year is required';
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
        validationError.bookId = 'bookId is required';
      }
      if (!review || !review.trim()) {
        validationError.review = 'review is required';
      }
      if (!rating || !rating.trim()) {
        validationError.rating = 'Rating is required';
      }
      if (rating >= 5.0) {
        validationError.rating = 'Rating can not be more than 5.0';
      }
      throw validationError;
    } catch (error) {
      return error;
    }
  }
}

export default Validator;
