import { dbInstance as db } from '../database';
import BaseRepository from '.';

class BookRepository extends BaseRepository {
  constructor() {
    super('Books');
  }

  async getAllBooks() {
    const query = `
      SELECT "${this.model}".*
      FROM "${this.model}"
      ORDER BY genre ASC;
    `;

    const queryConfig = {
      text: query,
    };

    try {
      const result = await db.query(queryConfig);

      return result.rows;
    } catch (error) {
      return error;
    }
  }
}

export default BookRepository;
