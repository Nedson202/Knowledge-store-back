import { dbQuery } from '..';
import logger from '../../utils/initLogger';

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

export const dropBookTable = async () => {
  const query = `
    DROP TABLE IF EXISTS "Books";
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
