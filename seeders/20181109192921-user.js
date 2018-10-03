const bcrypt = require('bcrypt');
const randomColor = require('randomcolor');

module.exports = {
  up: queryInterface => queryInterface.bulkInsert('Users',
    [
      {
        id: '1',
        username: 'smithon',
        email: 'netla@gmail.com',
        password: bcrypt.hashSync(process.env.FAKE_PASSWORD, 10),
        picture: 'https://cdn.pixabay.com/photo/2018/10/01/20/38/meteora-3717220_1280.jpg',
        isVerified: 'true',
        isEmailSent: 'true',
        avatarColor: randomColor({
          luminosity: 'dark',
          format: 'rgba',
          alpha: 0.9,
        }),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        username: 'maxwil',
        email: 'homie@gmail.com',
        password: bcrypt.hashSync(process.env.FAKE_PASSWORD, 10),
        picture: 'https://cdn.pixabay.com/photo/2018/09/30/19/03/railway-station-3714297_1280.jpg',
        isVerified: 'true',
        isEmailSent: 'true',
        avatarColor: randomColor({
          luminosity: 'dark',
          format: 'rgba',
          alpha: 0.9,
        }),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {}),
  down: queryInterface => queryInterface
    .bulkDelete('Users', new Date('2050-12-12'), {})
};
