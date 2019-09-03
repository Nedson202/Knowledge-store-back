import { dbQuery } from '..';
import logger from '../../utils/initLogger';

export const createLikeTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS
      "Likes" (
        id varchar(128) PRIMARY KEY NOT NULL,
        users varchar(128) [],
        likes INTEGER DEFAULT 0,
        "reviewId" varchar(128) REFERENCES "Reviews"(id),
        "replyId" varchar(128) REFERENCES "Replies"(id),
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP
      );
  `;

  const queryConfig = {
    text: query,
  };

  try {
    await dbQuery(queryConfig);
  } catch (error) {
    logger.info(error);
  }
};

export const dropLikeTable = async () => {
  const query = `
    DROP TABLE IF EXISTS "Likes";
  `;

  const queryConfig = {
    text: query,
  };

  try {
    await dbQuery(queryConfig);
  } catch (error) {
    logger.info(error);
  }
};
