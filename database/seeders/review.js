import { dbInstance as db } from '..';
import { loggerInstance as logger } from '../../logger';

export const seedReviews = async () => {
  const query = `
    INSERT INTO "Reviews"
      (id, review, rating, "bookId", "userId")
    VALUES
      ('1', 'Weird parts', 2.0, 'rV3LDQAAQBAJ', '2'),
      ('2', 'Good doctor', 2.5, 'FX0MAQAAIAAJ', '2'),
      ('3', 'Bad doctor', 3.1, 'FX0MAQAAIAAJ', '1'),
      ('4', 'Getting things in order', 1.0, 'fLxfAwAAQBAJ', '1'),
      ('5', 'Shouting out of order', 5.0, 'WCcBOvkZxI0C', '1'),
      ('6', 'Dancing order of things', 4.0, 'co9TJrTjqrIC', '2'),
      ('7', 'Old order of things', 3.5, 'WCcBOvkZxI0C', '1'),
      ('8', 'New order of things', 4.8, 'ddET09cVpF0C', '1'),
      ('9', 'agnista lohan', 3.9, 'ddET09cVpF0C', '2');
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

export const undoReviewSeed = async () => {
  const query = `
    DELETE
    FROM "Reviews"
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
