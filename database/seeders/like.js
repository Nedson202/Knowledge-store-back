import DB from '..';
import logger from '../../utils/initLogger';

const db = new DB();

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
