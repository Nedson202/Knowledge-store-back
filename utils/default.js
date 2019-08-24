export const bookLabel = 'book';
export const bookReviewsLabel = 'bookReviews';
export const favoriteBookLabel = 'favoriteBook';
export const replierLabel = 'replier';
export const reviewerLabel = 'reviewer';

export const noBookMessage = 'No books available';
export const noBookCreated = 'you have no books yet';
export const noReply = 'Reply not found';
export const noReview = 'Review not found';
export const noUser = 'User not found';
export const noBookFound = 'No book found';
export const bookUpdatedMessage = 'Book successfully updated';
export const bookDeletedMessage = 'Book successfully deleted';
export const bookAddedMessage = 'Book added successfully';
export const permissionDenied = 'Permission denied';
export const authStatusPermission = 'Permission denied, you need to signup/login';
export const addedToFavoriteMessage = 'Book added to favorites';
export const bookExistInFavorites = 'Book is in your list of favorites';
export const bookRemovedFromFavorites = 'Book(s) removed from your list of favorites';
export const userUnauthorizedMessage = 'Unauthorized, check your username or password';
export const resetLinkMessage = 'Password reset link has been sent to your email.';
export const resetSuccessful = 'Password reset was successful';
export const passwordChangeSuccessful = 'Password change was successful';
export const resetFailed = 'Password reset failed';
export const oldPasswordIncorrect = 'Sorry the old password provided is incorrect';
export const profileUpdated = 'Profile successfully updated';
export const emailNotSentMessage = 'Email not sent!';
export const emailSentMessage = 'Verification email sent successfully';
export const operationDenied = 'Operation denied';
export const userDeletedMessage = 'User has been deleted';
export const userIsAdmin = 'User is already an admin';
export const notAnAdmin = 'Permission denied, you are not an admin';
export const emailVerifiedMessage = 'Email verified successfully';
export const emailVerificationFailed = 'Email verification failed';
export const emailAlreadyVerified = 'Email already verified';
export const OTPFailed = 'OTP verification failed';
export const OTPSuccess = 'OTP verification successful';
export const forgotPasswordOPDenied = 'Forgot password operation denied';
export const resendOTPFailed = 'Resend OTP failed';
export const resendOTPSuccess = 'New OTP sent to email';
// sequelize
export const genreOrder = ['genre', 'ASC'];
export const descOrder = ['createdAt', 'DESC'];
export const userOrder = ['id', 'ASC'];
export const userAttributes = ['username', 'picture', 'avatarColor'];

export const googleBookOptions = {
  key: process.env.GOOGLE_BOOKS_KEY,
  field: 'title',
  offset: 0,
  limit: 40,
  zoom: 0,
  type: 'books',
  order: 'relevance',
  lang: 'en'
};

// info-logger
export const logFolderName = 'Error';
export const logFileName = 'log-result';

// roles
export const adminRole = 'admin';
export const superRole = 'super';
export const userRole = 'user';

// validator
export const usernameRequired = 'Username is required';
export const minimumPasswordLength = 'Minimum password length is 6';
export const invalidEmailMessage = 'Email format is invalid';
export const passwordPatternMessage = `Password must include lowercase,
uppercase, and special characters`;
export const bookNameRequired = 'book name is required';
export const genreIsRequired = 'genre is required';
export const publishedYearRequired = 'book published year is required';
export const bookAuthorRequired = 'book author(s) is required';
export const bookIdRequired = 'bookId is required';
export const reviewRequired = 'review is required';
export const ratingRequired = 'rating is required';
export const ratingSizeMessage = 'Rating can not be more than 5.0';
export const replyRequired = 'reply is required';
export const reviewIdRequired = 'reviewId is required';

export const production = 'production';
export const development = 'development';
export const darkLuminosity = 'dark';
export const colorFormat = 'rgba';

// Node events
export const unhandledRejection = 'unhandledRejection';
export const uncaughtException = 'uncaughtException';
export const SIGTERM = 'SIGTERM';

// elastic search
export const info = 'info';
export const elasticClientAlive = '-- Elastic client is still alive --';
export const elasticClientRunning = '-- Elastic client is up and running --';
export const booksIndex = 'books';
export const errorCreatingIndex = '-- An Error Occurred creating index';
export const indexCreated = '-- Index successfully created';
export const noIndex = '-- Index does not exist';
export const elasticMapping = {
  properties: {
    title: { type: 'text' },
    content: { type: 'text' },
    suggest: {
      type: 'completion',
      analyzer: 'simple',
      search_analyzer: 'standard',
    }
  }
};
export const phrasePrefix = 'phrase_prefix';
export const multimatchFields = [
  'id', 'name', 'description', 'authors', 'genres', 'year', 'userId'
];
export const indexDeleted = '-- Index successfully deleted';

export const devServer = 'http://localhost:3000';

export const verifyEmailSubject = 'Lorester\'s Bookstore - Verify Email';
export const passwordResetSubject = 'Lorester\'s Bookstore - Password reset help is here';
export const resendOTPSubject = 'Lorester\'s Bookstore - New OTP request';
