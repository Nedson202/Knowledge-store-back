import { stackLogger } from 'info-logger';
import BaseRepository from '.';
import DB from '../database';

const db = new DB();

class ReplyRepository extends BaseRepository {
  constructor() {
    super('Replies');
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
        ON "${this.model}"."id" = "Likes"."replyId"
      WHERE "${this.model}"."deletedAt" IS NULL
        AND "Users"."deletedAt" IS NULL
    `;

    const fields = Object.keys(findQuery);
    const values = Object.values(findQuery);

    fields.forEach((field, index) => {
      query = `${query} AND "${this.model}"."${field}" = $${index + 1}`;
    });

    const queryConfig = {
      text: query,
      values,
    };

    try {
      const result = await db.query(queryConfig);

      return result.rows;
    } catch (error) {
      stackLogger(error);
      return error;
    }
  }
}

export default ReplyRepository;
