import { dbInstance as db } from '..';
import { loggerInstance as logger } from '../../logger';

export const createBookTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS
      "Books" (
        id varchar(128) PRIMARY KEY NOT NULL,
        name varchar(255) UNIQUE NOT NULL,
        genre TEXT [],
        authors TEXT [],
        downloadable TEXT [],
        year varchar(128),
        description TEXT,
        image TEXT,
        "pageCount" varchar(128),
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

export const dropBookTable = async () => {
  const query = `
    DROP TABLE IF EXISTS "Books";
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
