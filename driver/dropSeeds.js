import { undoUserSeed } from './seeders/user';
import { undoReplySeed } from './seeders/reply';
import { undoReviewSeed } from './seeders/review';
import { undoLikeSeed } from './seeders/like';
import { undoFavoriteSeed } from './seeders/favorite';
import { undoGenreSeed } from './seeders/genre';
import { undoBookSeed } from './seeders/book';

(async () => {
  undoGenreSeed();
  await undoLikeSeed();
  await undoFavoriteSeed();
  await undoReplySeed();
  await undoReviewSeed();
  await undoBookSeed();
  undoUserSeed();
})();
