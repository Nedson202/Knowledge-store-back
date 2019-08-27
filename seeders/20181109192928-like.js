module.exports = {
  up: queryInterface => queryInterface.bulkInsert('Likes',
    [
      {
        id: '1',
        users: ['Weird parts'],
        likes: 30,
        reviewId: '3',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        users: ['Good doctor'],
        likes: 10,
        reviewId: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {}),
  down: queryInterface => queryInterface
    .bulkDelete('Likes', null, {})
};
