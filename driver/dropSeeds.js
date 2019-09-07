import { Pool } from 'pg';
import { undoUserSeed } from './seeders/user';
import { undoReplySeed } from './seeders/reply';
import { undoReviewSeed } from './seeders/review';
import { undoLikeSeed } from './seeders/like';
import { undoFavoriteSeed } from './seeders/favorite';
import { undoGenreSeed } from './seeders/genre';
import { undoBookSeed } from './seeders/book';
import config from './config';

const pool = new Pool(config);

const db = pool;

(async () => {
  undoGenreSeed(db);
  await undoLikeSeed(db);
  await undoFavoriteSeed(db);
  await undoReplySeed(db);
  await undoReviewSeed(db);
  await undoBookSeed(db);
  await undoUserSeed(db);
})();
