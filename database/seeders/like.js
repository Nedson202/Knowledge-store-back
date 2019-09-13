import { dbQuery } from '..';
import logger from '../../utils/initLogger';

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
    await dbQuery(queryConfig);
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
    await dbQuery(queryConfig);
  } catch (error) {
    logger.info(error);
  }
};
