import { dbInstance as db } from '..';
import { loggerInstance as logger } from '../../logger';

export const createFavoriteTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS
      "Favorites" (
        id varchar(128) PRIMARY KEY NOT NULL,
        "bookId" varchar(128) REFERENCES "Books"(id),
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

export const dropFavoriteTable = async () => {
  const query = `
    DROP TABLE IF EXISTS "Favorites";
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
