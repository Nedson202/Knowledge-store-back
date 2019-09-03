import { dropUserTable } from './migrations/user';
import { dropFavoriteTable } from './migrations/favorite';
import { dropLikeTable } from './migrations/like';
import { dropReplyTable } from './migrations/reply';
import { dropGenreTable } from './migrations/genre';
import { dropBookTable } from './migrations/book';
import { dropReviewTable } from './migrations/review';

(async () => {
  dropGenreTable();
  await dropLikeTable();
  await dropFavoriteTable();
  await dropReplyTable();
  await dropReviewTable();
  await dropBookTable();
  dropUserTable();
})();
