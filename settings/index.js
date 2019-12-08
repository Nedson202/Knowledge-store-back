export const BOOK_LABEL = 'book';
export const BOOK_REVIEWS_LABEL = 'bookReviews';
export const FAVORITE_BOOK_LABEL = 'favoriteBook';
export const REPLIER_LABEL = 'replier';
export const REVIEWER_LABEL = 'reviewer';

export const NO_BOOK_MESSAGE = 'No books available';
export const NO_BOOK_CREATED = 'you have no books yet';
export const NO_REPLY = 'Reply not found';
export const NO_REVIEW = 'Review not found';
export const NO_USER = 'User not found';
export const NO_BOOK_FOUND = 'No book found';
export const BOOK_UPDATED_MESSAGE = 'Book successfully updated';
export const BOOK_DELETED_MESSAGE = 'Book successfully deleted';
export const BOOK_ADDED_MESSAGE = 'Book added successfully';
export const PERMISSION_DENIED = 'Permission denied';
export const AUTH_STATUS_PERMISSION = 'Permission denied, you need to signup/login';
export const ADDED_TO_FAVORITE = 'Book added to favorites';
export const BOOK_EXIST_IN_FAVORITES = 'Book is in your list of favorites';
export const BOOK_REMOVED_FROM_FAVORITES = 'Book(s) removed from your list of favorites';
export const USER_UNAUTHORIZED = 'Unauthorized, check your username or password';
export const RESET_LINK_MESSAGE = 'Password reset link has been sent to your email.';
export const RESET_SUCCESSFUL = 'Password reset was successful';
export const PASSWORD_CHANGE_SUCCESSFUL = 'Password change was successful';
export const RESET_FAILED = 'Password reset failed';
export const OLD_PASSWORD_INCORRECT = 'Sorry the old password provided is incorrect';
export const PROFILE_UPDATED = 'Profile successfully updated';
export const EMAIL_NOT_SENT_MESSAGE = 'Email not sent!';
export const EMAIL_SENT_MESSAGE = 'Verification email sent successfully';
export const OPERATION_DENIED = 'Operation denied';
export const USER_DELETED_MESSAGE = 'User has been deleted';
export const USER_IS_ADMIN = 'User is already an admin';
export const NOT_AN_ADMIN = 'Permission denied, you are not an admin';
export const EMAIL_VERIFIED_MESSAGE = 'Email verified successfully';
export const EMAIL_VERIFICATION_FAILED = 'Email verification failed';
export const EMAIL_ALREADY_VERIFIED = 'Email already verified';
export const OTP_FAILED = 'OTP verification failed';
export const OTP_SUCCESS = 'OTP verification successful';
export const FORGOT_PASSWORD_OP_DENIED = 'Forgot password operation denied';
export const OTP_RESEND_FAILED = 'Resend OTP failed';
export const OTP_RESEND_SUCCESS = 'New OTP sent to email';

export const GOOGLE_BOOK_OPTIONS = {
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
export const LOG_FOLDER_NAME = 'Error';
export const LOG_FILE_NAME = 'log-result';

// roles
export const ADMIN_ROLE = 'admin';
export const SUPER_ADMIN_ROLE = 'super';
export const USER_ROLE = 'user';

export const PRODUCTION = 'production';
export const TEST = 'test';
export const DEVELOPMENT = 'development';
export const DARK_LUMINOSITY = 'dark';
export const COLOR_FORMAT = 'rgba';

// Node events
export const UNHANDLED_EXCEPTION = 'UNHANDLED_EXCEPTION';
export const UNCAUGHT_EXCEPTION = 'UNCAUGHT_EXCEPTION';
export const SIGTERM = 'SIGTERM';

// elastic search
export const info = 'info';
export const BOOK = 'book';
export const ELASTIC_CLIENT_ALIVE = '-- Elastic client is still alive --';
export const ELASTIC_CLIENT_RUNNING = '-- Elastic client is up and running --';
export const BOOKS_INDEX = 'books';
export const ERROR_CREATING_INDEX = '-- An Error Occurred creating index';
export const INDEX_CREATED_MESSAGE = '-- Index successfully created';
export const NO_INDEX = '-- Index does not exist --';
export const ELASTIC_SEARCH_MAPPING = {
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
export const PHRASE_PREFIX = 'phrase_prefix';
export const MULTI_MATCH_FIELDS = [
  'id', 'name', 'description', 'authors', 'genres', 'year', 'userId'
];
export const INDEX_DELETED_MESSAGE = '-- Index successfully deleted --';

export const DEV_SERVER = 'http://localhost:3000';

export const VERIFY_EMAIL_SUBJECT = 'Lorester\'s Bookstore - Verify Email';
export const PASSWORD_RESET_SUBJECT = 'Lorester\'s Bookstore - Password reset help is here';
export const RESENT_OTP_SUBJECT = 'Lorester\'s Bookstore - New OTP request';
