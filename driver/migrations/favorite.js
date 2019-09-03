import { dbQuery } from '..';
import logger from '../../utils/initLogger';

export const createFavoriteTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS
      "Favorites" (
        id varchar(128) PRIMARY KEY NOT NULL,
        "bookId" varchar(128) REFERENCES "Books"(id),
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

export const dropFavoriteTable = async () => {
  const query = `
    DROP TABLE IF EXISTS "Favorites";
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
