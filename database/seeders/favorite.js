import { dbInstance as db } from '..';
import { loggerInstance as logger } from '../../logger';

export const seedFavorites = async () => {
  const query = `
    INSERT INTO "Favorites"
      (id, "userId", "bookId")
    VALUES
      ('1', '1', 'ddET09cVpF0C'),
      ('2', '2', 'cWsa2lz8QvYC'),
      ('3', '2', '-Jw_YgEACAAJ'),
      ('4', '2', 'm3orAQAAIAAJ'),
      ('5', '1', 'Vr52AAAAMAAJ'),
      ('6', '1', 'rV3LDQAAQBAJ'),
      ('7', '2', 'FX0MAQAAIAAJ'),
      ('8', '1', 'fLxfAwAAQBAJ');
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

export const undoFavoriteSeed = async () => {
  const query = `
    DELETE
    FROM "Favorites"
    WHERE
      id IN ('1', '2', '3', '4', '5', '6', '7', '8');
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
