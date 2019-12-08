import ValidatorJS from 'validatorjs';

class Validator {
  /**
   *
   *
   * @static
   * @param {*} data
   * @returns
   * @memberof Validator
   */
  static validateLogin(data) {
    const rules = {
      username: 'required',
      password: 'min:6',
    };

    const validationResponse = {};

    try {
      const validation = new ValidatorJS(data, rules);
      validationResponse.isValid = validation.passes();

      if (!validationResponse.isValid) {
        validationResponse.errors = validation.errors.all();
      }

      return validationResponse;
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
      const rules = {
        username: 'required',
        email: 'required|email',
        password: 'min:6',
      };

      const validationResponse = {};

      const validation = new ValidatorJS(data, rules);
      validationResponse.isValid = validation.passes();

      if (!validationResponse.isValid) {
        validationResponse.errors = validation.errors.all();
      }

      return validationResponse;
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
    try {
      const rules = {
        name: 'required',
        genre: 'required',
        year: 'required',
        author: 'required',
      };

      const validationResponse = {};

      const validation = new ValidatorJS(data, rules);
      validationResponse.isValid = validation.passes();

      if (!validationResponse.isValid) {
        validationResponse.errors = validation.errors.all();
      }

      return validationResponse;
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
    try {
      const rules = {
        bookId: 'required',
        review: 'required',
        rating: 'max:5.0',
      };

      const validationResponse = {};

      const validation = new ValidatorJS(data, rules);
      validationResponse.isValid = validation.passes();

      if (!validationResponse.isValid) {
        validationResponse.errors = validation.errors.all();
      }

      return validationResponse;
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
    try {
      const rules = {
        reviewId: 'required',
        reply: 'required',
      };

      const validationResponse = {};

      const validation = new ValidatorJS(data, rules);
      validationResponse.isValid = validation.passes();

      if (!validationResponse.isValid) {
        validationResponse.errors = validation.errors.all();
      }

      return validationResponse;
    } catch (error) {
      return error;
    }
  }
}

export default Validator;
