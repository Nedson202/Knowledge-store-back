module.exports = {
  up: queryInterface => queryInterface.bulkInsert('Favorites',
    [
      {
        id: '1',
        userId: '1',
        bookId: 'ddET09cVpF0C',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        userId: '2',
        bookId: '-Jw_YgEACAAJ',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '3',
        userId: '2',
        bookId: 'm3orAQAAIAAJ',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '4',
        userId: '2',
        bookId: 'Vr52AAAAMAAJ',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '5',
        userId: '1',
        bookId: 'rV3LDQAAQBAJ',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '6',
        userId: '1',
        bookId: 'FX0MAQAAIAAJ',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '7',
        userId: '1',
        bookId: 'fLxfAwAAQBAJ',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '8',
        userId: '1',
        bookId: 'cWsa2lz8QvYC',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {}),
  down: queryInterface => queryInterface
    .bulkDelete('Favorites', {
      id: [
        '1', '2', '3', '4', '5', '6', '7', '8',
      ]
    }, {})
};
