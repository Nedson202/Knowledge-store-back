import { dbQuery } from '..';
import logger from '../../utils/initLogger';

export const createUserTable = async () => {
  const query = `
    DO $$ BEGIN
      CREATE TYPE
        user_role AS ENUM('user', 'admin', 'super');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      CREATE TYPE
        verified_status AS ENUM('false', 'true');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    CREATE TABLE IF NOT EXISTS
      "Users" (
        id varchar(128) PRIMARY KEY NOT NULL,
        username varchar(255) UNIQUE NOT NULL,
        email varchar(255) UNIQUE NOT NULL,
        password varchar NOT NULL,
        picture varchar,
        role user_role NOT NULL DEFAULT 'user',
        "isVerified" verified_status NOT NULL Default 'false',
        "isEmailSent" verified_status NOT NULL Default 'false',
        "socialId" varchar(128),
        "avatarColor" varchar(128),
        "OTPSecret" varchar(128),
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "deletedAt" TIMESTAMP
      );

    ALTER TABLE "Users" ALTER COLUMN "isEmailSent" SET DATA TYPE text USING "isEmailSent"::text;

    ALTER TABLE "Users" ALTER COLUMN "isVerified" SET DATA TYPE text USING "isVerified"::text;
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

export const dropUserTable = async () => {
  const query = `
    DROP TABLE IF EXISTS "Users";
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
