import { seedUser } from './seeders/user';
import { seedReplies } from './seeders/reply';
import { seedReviews } from './seeders/review';
import { seedLikes } from './seeders/like';
import { seedFavorites } from './seeders/favorite';
import { seedGenre } from './seeders/genre';
import { seedBooks } from './seeders/book';

(async () => {
  seedGenre();
  await seedUser();
  await seedBooks();
  await seedReviews();
  await seedReplies();
  seedLikes();
  seedFavorites();
})();
