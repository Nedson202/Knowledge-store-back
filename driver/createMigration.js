import { createUserTable } from './migrations/user';
import { createFavoriteTable } from './migrations/favorite';
import { createLikeTable } from './migrations/like';
import { createReplyTable } from './migrations/reply';
import { createGenreTable } from './migrations/genre';
import { createBookTable } from './migrations/book';
import { createReviewTable } from './migrations/review';

(async () => {
  createGenreTable();
  await createUserTable();
  await createBookTable();
  await createReviewTable();
  await createReplyTable();
  createLikeTable();
  createFavoriteTable();
})();
