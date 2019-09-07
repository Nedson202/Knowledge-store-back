import { dbQuery } from '../driver';
import BaseRepository from '.';

class GenreRepository extends BaseRepository {
  constructor() {
    super('Genres');
  }

  async getAll() {
    const query = `
      SELECT "${this.model}".*
      FROM "${this.model}"
      ORDER BY genre ASC;
    `;

    const queryConfig = {
      text: query,
    };

    try {
      const result = await dbQuery(queryConfig);
      return result.rows;
    } catch (error) {
      return error;
    }
  }
}

export default GenreRepository;
