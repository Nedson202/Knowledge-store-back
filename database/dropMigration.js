import { Pool } from 'pg';
import { dropUserTable } from './migrations/user';
import { dropFavoriteTable } from './migrations/favorite';
import { dropLikeTable } from './migrations/like';
import { dropReplyTable } from './migrations/reply';
import { dropGenreTable } from './migrations/genre';
import { dropBookTable } from './migrations/book';
import { dropReviewTable } from './migrations/review';
import config from './config';

(async () => {
  const pool = new Pool(config);

  const db = pool;

  dropGenreTable(db);
  await dropFavoriteTable(db);
  await dropReplyTable(db);
  await dropReviewTable(db);
  await dropLikeTable(db);
  await dropBookTable(db);
  dropUserTable(db);
})();
