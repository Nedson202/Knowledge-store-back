import DB from '..';
import logger from '../../utils/initLogger';

const db = new DB();

export const seedReplies = async () => {
  const query = `
    INSERT INTO "Replies"
      (id, reply, "reviewId", "userId")
    VALUES
      ('1', 'Weird parts', '3', '2'),
      ('2', 'Good doctor', '1', '2'),
      ('3', 'Bad doctor', '3', '1'),
      ('4', 'Getting things in order', '1', '1'),
      ('5', 'Shouting out of order', '3', '1'),
      ('6', 'Dancing order of things', '4', '2'),
      ('7', 'Old order of things', '4', '1'),
      ('8', 'New order of things', '4', '1'),
      ('9', 'agnista lohan', '2', '2');
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
    await db.query(queryConfig);
  } catch (error) {
    logger.info(error);
  }
};
