import { Pool } from 'pg';

import { createUserTable } from './migrations/user';
import { createFavoriteTable } from './migrations/favorite';
import { createLikeTable } from './migrations/like';
import { createReplyTable } from './migrations/reply';
import { createGenreTable } from './migrations/genre';
import { createBookTable } from './migrations/book';
import { createReviewTable } from './migrations/review';
import config from './config';

const pool = new Pool(config);

const db = pool;

(async () => {
  createGenreTable(db);
  await createUserTable(db);
  await createBookTable(db);
  await createReviewTable(db);
  await createReplyTable(db);
  createLikeTable(db);
  createFavoriteTable(db);
})();
