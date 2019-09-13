import { Pool } from 'pg';

import { seedUser } from './seeders/user';
import { seedReplies } from './seeders/reply';
import { seedReviews } from './seeders/review';
import { seedLikes } from './seeders/like';
import { seedFavorites } from './seeders/favorite';
import { seedGenre } from './seeders/genre';
import { seedBooks } from './seeders/book';
import config from './config';

const pool = new Pool(config);

const db = pool;

(async () => {
  seedGenre(db);
  await seedUser(db);
  await seedBooks(db);
  await seedLikes(db);
  await seedReviews(db);
  await seedReplies(db);
  seedFavorites(db);
})();
