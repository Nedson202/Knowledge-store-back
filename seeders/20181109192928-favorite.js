module.exports = {
  up: queryInterface => queryInterface.bulkInsert('Favorites',
    [
      {
        id: '1',
        userId: '1',
        bookId: '2',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        userId: '2',
        bookId: '4',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {}),
  down: queryInterface => queryInterface
    .bulkDelete('Likes', new Date('2050-12-12'), {})
};
