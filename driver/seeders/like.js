import { dbQuery } from '..';
import logger from '../../utils/initLogger';

export const seedLikes = async () => {
  const query = `
    INSERT INTO "Likes"
      (id, users, likes, "reviewId")
    VALUES
      ('1', '{"Weird parts"}', 30, '3'),
      ('2', '{"Good doctor"}', 10, '1');
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
