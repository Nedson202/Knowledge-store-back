import BaseRepository from '.';
import { dbQuery } from '../database';

class ReviewRepository extends BaseRepository {
  constructor() {
    super('Reviews');
  }

  async getAll(findQuery) {
    let query = `
      SELECT
        "${this.model}".*, "Users".username, "Users".picture, "Users"."avatarColor",
        "Likes".likes, "Likes"."users"
      FROM "${this.model}"
      LEFT OUTER JOIN "Users"
        ON "${this.model}"."userId" = "Users".id
      LEFT OUTER JOIN "Likes"
        ON "${this.model}"."id" = "Likes"."reviewId"
      WHERE "Users"."deletedAt" IS NULL
        AND "${this.model}"."deletedAt" IS NULL
    `;

    const fields = Object.keys(findQuery);
    const values = Object.values(findQuery);

    fields.forEach((field, index) => {
      query = `${query} AND "${this.model}"."${field}" = $${index + 1}`;
    });

    query = `
      ${query}
      ORDER BY "createdAt" DESC;
    `;

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

export default ReviewRepository;
