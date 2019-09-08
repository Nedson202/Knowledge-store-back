import { dbQuery } from '..';
import logger from '../../utils/initLogger';

export const seedReplies = async () => {
  const query = `
    INSERT INTO "Replies"
      (id, reply, likes, "reviewId", "userId")
    VALUES
      ('1', 'Weird parts', 30, '3', '2'),
      ('2', 'Good doctor', 10, '1', '2'),
      ('3', 'Bad doctor', 40, '3', '1'),
      ('4', 'Getting things in order', 120, '1', '1'),
      ('5', 'Shouting out of order', 80, '3', '1'),
      ('6', 'Dancing order of things', 34, '4', '2'),
      ('7', 'Old order of things', 1, '4', '1'),
      ('8', 'New order of things', 3, '4', '1'),
      ('9', 'agnista lohan', 301, '3', '2');
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

export const undoReplySeed = async () => {
  const query = `
    DELETE
    FROM "Replies"
    WHERE
      id IN ('1', '2', '3', '4', '5', '6', '7', '8', '9');
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
