import { Pool } from 'pg';

import { createUserTable } from './migrations/user';
import { createFavoriteTable } from './migrations/favorite';
import { createLikeTable } from './migrations/like';
import { createReplyTable } from './migrations/reply';
import { createGenreTable } from './migrations/genre';
import { createBookTable } from './migrations/book';
import { createReviewTable } from './migrations/review';
import config from './config';

(async () => {
  const pool = new Pool(config);

  const db = pool;

  createGenreTable(db);
  await createUserTable(db);
  await createBookTable(db);
  await createLikeTable(db);
  await createReviewTable(db);
  await createReplyTable(db);
  createFavoriteTable(db);
})();
