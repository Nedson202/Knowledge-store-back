import { dbInstance as db } from '..';
import { loggerInstance as logger } from '../../logger';

export const createReviewTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS
      "Reviews" (
        id varchar(128) PRIMARY KEY NOT NULL,
        review TEXT NOT NULL,
        rating FLOAT DEFAULT 0,
        "userId" varchar(128) REFERENCES "Users"(id),
        "bookId" varchar(128) REFERENCES "Books"(id),
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "deletedAt" TIMESTAMP
      );

    CREATE INDEX IF NOT EXISTS "book_id_index"
      ON "Reviews" ("bookId");
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

export const dropReviewTable = async () => {
  const query = `
    DROP TABLE IF EXISTS "Reviews";

    DROP INDEX IF EXISTS "book_id_index";
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
