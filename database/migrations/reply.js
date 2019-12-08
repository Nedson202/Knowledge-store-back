import DB from '..';
import logger from '../../utils/initLogger';

const db = new DB();

export const createReplyTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS
      "Replies" (
        id varchar(128) PRIMARY KEY NOT NULL,
        reply TEXT NOT NULL,
        "reviewId" varchar(128) REFERENCES "Reviews"(id),
        "userId" varchar(128) REFERENCES "Users"(id),
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "deletedAt" TIMESTAMP
      );
  `;

  const queryConfig = {
    text: query,
  };

  try {
    await db.query(queryConfig);
  } catch (error) {
    logger.info(error);
  }
};

export const dropReplyTable = async () => {
  const query = `
    DROP TABLE IF EXISTS "Replies";
  `;

  const queryConfig = {
    text: query,
  };

  try {
    await db.query(queryConfig);
  } catch (error) {
    logger.info(error);
  }
};
