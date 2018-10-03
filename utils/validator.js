class Validator {
  static validateData(data) {
    const { username, password } = data;
    const error = {};
    const pattern = /^[A-Za-z0-9!@#$%^&*()_]{6,10}$/;
    try {
      if (!username || !username.trim()) error.username = 'Username is required';
      if (!password || !password.trim() || password.length < 6)
        error.password = 'Minimum password length is 6';
      if (!pattern.test(password))
        error.password = 'Password must include lowercase, uppercase, and special characters';
      throw error;
    } catch(error) {
      return error;
    }
  }

  static validateEmail(data) {
    const { email } = data;
    const error = {};
    const pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    try {
      if (!email || !email.trim() || !pattern.test(email)) error.email = 'Email format is invalid';
        throw error;
    } catch(error) {
      return error
    }
  }

  static validateSignup(data) {
    try {
      let error = {};
      const dataError = Validator.validateData(data);
      const emailError = Validator.validateEmail(data);
      error = {...dataError, ...emailError};
      console.log(error)
      // dataError.email = emailError ? emailError.email : null;
      throw error;
    } catch(error) {
      return error;
    }
  }

  static validateAddBook(data) {
    const { name, author, genre, year } = data;
    const error = {};
    try {
      if (!name || !name.trim()) error.name = 'book name is required';
      if (!genre || !genre.trim()) error.genre = 'genre is required';
      if (!year || !year.trim()) error.year = 'book published year is required';
      if (!author || !author.trim()) error.author = 'book published year is required';
      throw error;
    } catch(error) {
      return error;
    }
  }
}

export default Validator;