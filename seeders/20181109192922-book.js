module.exports = {
  up: queryInterface => queryInterface.bulkInsert('Books',
    [
      {
        id: '1',
        name: 'Weird parts',
        genre: ['art'],
        authors: ['nolan'],
        year: 1904,
        userId: '2',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        name: 'Good doctor',
        genre: ['art'],
        authors: ['mill'],
        year: 2030,
        userId: '2',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '3',
        name: 'Getting things in order',
        genre: ['guide'],
        authors: ['max'],
        year: 1994,
        userId: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '4',
        name: 'Order of things',
        genre: ['philosophy'],
        authors: ['miller'],
        year: 2001,
        userId: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {}),
  down: queryInterface => queryInterface
    .bulkDelete('Books', new Date('2050-12-12'), {})
};
