import { dbInstance as db } from '..';
import { loggerInstance as logger } from '../../logger';

export const seedLikes = async () => {
  const query = `
    INSERT INTO "Likes"
      (id, users, likes)
    VALUES
      ('1', '["1", "2"]', 30),
      ('2', '["1"]', 10);
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

export const undoLikeSeed = async () => {
  const query = `
    DELETE
    FROM "Likes"
    WHERE
      id IN ('1', '2');
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
