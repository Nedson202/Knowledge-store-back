import { dbQuery } from '../driver';
import BaseRepository from '.';

class FavoritesRepository extends BaseRepository {
  constructor() {
    super('Favorites');
  }

  async getFavoriteBooks(findQuery) {
    let query = `
      SELECT "Books".*
      FROM "${this.model}"
      LEFT OUTER JOIN "Books"
        ON "Favorites"."bookId" = "Books".id
      WHERE "Favorites"."deletedAt" IS NULL
        AND "Books"."deletedAt" IS NULL
    `;

    const fields = Object.keys(findQuery);
    const values = Object.values(findQuery);

    fields.forEach((field, index) => {
      query = `${query} AND "Favorites"."${field}" = $${index + 1}`;
    });

    const queryConfig = {
      text: query,
      values,
    };

    try {
      const result = await dbQuery(queryConfig);
      return result.rows;
    } catch (error) {
      return error;
    }
  }
}

export default FavoritesRepository;
