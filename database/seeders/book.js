import { dbInstance as db } from '..';
import { loggerInstance as logger } from '../../logger';
/* eslint-disable max-len */

export const seedBooks = async () => {
  const query = `
    INSERT INTO "Books"
      (id, name, year, authors, "userId", image, description, "pageCount", genre, downloadable)
    VALUES
      ('Vr52AAAAMAAJ', 'The Pacificus-Helvidius Debates of 1793-1794', '2007',
        '{"Alexander Hamilton", "James Madison"}', '1', 'http://books.google.com/books/content?id=Vr52AAAAMAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api',
        'The Pacificus-Helvidius Debates of 1793-1794 matched Hamilton and Madison in the first chapter of an enduring discussion about the proper roles of the
        executive and legislative branches in the conduct of American foreign policy. Ignited by President Washington Neutrality Proclamation of 1793, the debate
        addressed whether Washington had the authority to declare America neutral, despite an early alliance treaty with France. Hamilton argued that Washington
        actions were constitutional and that friction between the two branches was an unavoidable, but not harmful, consequence of the separation of powers.
        Madison countered that Washington proclamation would introduce new principles and new constructions into the Constitution. While the Pacificus-Helvidius
        debates did not resolve this ongoing constitutional controversy, they did define the grounds upon which this question was to be examined, to this very day.',
        '121', '{"History"}', '{null}'
      ),
      ('m3orAQAAIAAJ', 'Voice of Hezbollah', '2007',
        '{"Ḥasan Naṣr Allāh"}', '1', 'http://books.google.com/books/content?id=m3orAQAAIAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api',
        'A comprehensive English translation of the speeches by and interviews with the secretary general of Lebanons Party of God offers insight
        into his credibility with both his supporters and detractors as well as his role in ejecting Israelis from Arab lands. Original.',
        '420', '{"History"}', '{null}'
      ),
      ('-Jw_YgEACAAJ', 'Women War Artists', '2011',
        '{"Kathleen Palmer"}', '2', 'http://books.google.com/books/content?id=-Jw_YgEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api',
        'From womens representations of the Blitz and the liberation of Belsen to contemporary icons like Rachel Whitereads Holocaust Monument in Vienna,
        this book explores the contribution made by women artists to our understanding of war.',
        '89', '{"Art", "British"}', '{null}'
      ),
      ('ddET09cVpF0C', 'Mastering the Art of War', '2005',
        '{"Liang Zhuge", "Ja Liu"}', '2', 'http://books.google.com/books/content?id=ddET09cVpF0C&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
        'Composed by two prominent statesmen-generals of classical China, this book develops the strategies of Sun Tzus classic, The Art of War , into a complete
        handbook of organization and leadership. The great leaders of ancient China who were trained in Sun Tzus principles understood how war is waged successfully,
        both materially and mentally, and how victory and defeat follow clear social, psychological, and environmental laws. Drawing on episodes from the panorama of
        Chinese history, Mastering the Art of War presents practical summaries of these essential laws along with tales of conflict and strategy that show in concrete
        terms the proper use of Sun Tzus principles. The book also examines the social and psychological aspects of organization and crisis management. The translators
        introduction surveys the Chinese philosophies of war and conflict and explores in depth the parallels between The Art of War and the oldest handbook of strategic
        living, the I Ching (Book of Changes).',
        '209', '{"Philosophy"}', '{null}'
      ),
      ('cWsa2lz8QvYC', 'Sun-Tzu: The Art of Warfare', '2010-09-08',
        '{"Roget T. Ames"}', '1', 'http://books.google.com/books/content?id=cWsa2lz8QvYC&printsec=frontcover&img=1&zoom=1&source=gbs_api',
        'The most widely read military classic in human history, newly translated and revised in accordance with newly discovered materials
        of unprecedented historical significance. Fluid, crisp and rigorously faithful to the original, this new text is destined to stand as
        the definitive version of this cornerstone work of Classical Chinese. Of compelling importance not only to students of Chinese history
        and literature, but to all readers interested in the art or the philosophy of war. From the Hardcover edition.',
        '336', '{"Philosophy"}', '{null}'
      ),
      ('co9TJrTjqrIC', 'U.S. Army War College Guide to National Security Policy and Strategy', '',
        '{"null"}', '1', 'http://books.google.com/books/content?id=co9TJrTjqrIC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
        '', '', '{"Security"}', '{null}'
      ),
      ('WCcBOvkZxI0C', 'Constraints on the Waging of War', '1987',
        '{"Frits Kalshoven"}', '1', 'http://books.google.com/books/content?id=WCcBOvkZxI0C&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
        'CONTENTS.', '175', '{"Law"}', '{null}'
      ),
      ('FX0MAQAAIAAJ', 'An Introduction to the Art of War', '1970',
        '{"Shiva Tosh Das"}', '2', 'http://books.google.com/books/content?id=FX0MAQAAIAAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
        null, '447', '{"Military art and science"}', '{null, null}'
      ),
      ('rV3LDQAAQBAJ', 'The Art of War', '2000',
        '{"Sun Tzu"}', '2', 'http://books.google.com/books/content?id=rV3LDQAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
        'The Art of War is the oldest and most influential military strategy text in existence, and Sun Tzus teachings on how to successfully
          respond to and handle situations of conflict is a must-read for for todays business leaders (and politicians, and many others).
          Whether you approach this reading for its historical significance or choose to apply this knowledge toward achieving success in your own life,
          you will be enlightened. This elegantly designed clothbound edition features an elastic closure and a new introduction.',
        '260', '{"History"}', '{null, null}'
      ),
      ('fLxfAwAAQBAJ', 'A Scrap of Paper', '2014',
        '{"Isabel V. Hull"}', '2', 'http://books.google.com/books/content?id=fLxfAwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
        'Isabel V. Hull compares the World War I decision making of Germany, Great Britain, and France, weighing the impact of legal considerations in each.',
        '368', '{"History"}', '{null}'
      );
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

export const undoBookSeed = async () => {
  const query = `
    DELETE
    FROM "Books"
    WHERE
      id IN (
        'rV3LDQAAQBAJ',
        'FX0MAQAAIAAJ',
        'fLxfAwAAQBAJ',
        'WCcBOvkZxI0C',
        'co9TJrTjqrIC',
        'cWsa2lz8QvYC',
        'ddET09cVpF0C',
        '-Jw_YgEACAAJ',
        'm3orAQAAIAAJ',
        'Vr52AAAAMAAJ'
      );
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
