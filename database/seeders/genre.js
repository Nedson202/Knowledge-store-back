import DB from '..';
import logger from '../../utils/initLogger';

const db = new DB();

export const seedGenre = async () => {
  const query = `
    INSERT INTO "Genres"
      (id, genre)
    VALUES
      ('1', 'Fiction'),
      ('2', 'Satire'),
      ('3', 'Drama'),
      ('4', 'Action'),
      ('5', 'Romance'),
      ('6', 'Mystery'),
      ('7', 'Horror'),
      ('8', 'Self Help'),
      ('9', 'Health'),
      ('10', 'Guide'),
      ('11', 'Travel'),
      ('12', 'Children'),
      ('13', 'Religion'),
      ('14', 'Science'),
      ('15', 'History'),
      ('16', 'Math'),
      ('17', 'Anthology'),
      ('18', 'Poetry'),
      ('19', 'Encyclopedias'),
      ('20', 'Dictionaries'),
      ('21', 'Comics'),
      ('22', 'Art'),
      ('23', 'Cookbooks'),
      ('24', 'Diaries'),
      ('25', 'Journals'),
      ('26', 'Prayer books'),
      ('27', 'Series'),
      ('28', 'Trilogy'),
      ('29', 'Biographies'),
      ('30', 'Autobiographies'),
      ('31', 'Fantasy'),
      ('32', 'Philosophy'),
      ('33', 'Military and War'),
      ('34', 'Anime'),
      ('35', 'Psychology'),
      ('36', 'Real Estate'),
      ('37', 'Sport'),
      ('38', 'Adventure'),
      ('39', 'Spirituality');
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

export const undoGenreSeed = async () => {
  const query = `
    DELETE
    FROM "Genres"
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
