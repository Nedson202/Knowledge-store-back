import bcrypt from 'bcrypt';
import randomColor from 'randomcolor';
import DB from '..';
import logger from '../../utils/initLogger';

const db = new DB();

export const seedUser = async () => {
  const fakePassword = bcrypt.hashSync(process.env.FAKE_PASSWORD, 10);
  const avatarColor = randomColor({
    luminosity: 'dark',
    format: 'rgba',
    alpha: 0.9,
  });

  const query = `
    INSERT INTO "Users"
      (id, username, email, password, picture, "isVerified", "isEmailSent", "avatarColor")
    VALUES
      ('1', 'smithon', 'netla@gmail.com', '${fakePassword}',
        'https://cdn.pixabay.com/photo/2018/10/01/20/38/meteora-3717220_1280.jpg',
        'true', 'true', '${avatarColor}'),
      ('2', 'maxwil', 'homie@gmail.com', '${fakePassword}',
        'https://cdn.pixabay.com/photo/2018/09/30/19/03/railway-station-3714297_1280.jpg',
        'true', 'true', '${avatarColor}');
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

export const undoUserSeed = async () => {
  const query = `
    DELETE
    FROM "Users"
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
