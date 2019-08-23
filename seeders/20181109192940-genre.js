module.exports = {
  up: queryInterface => queryInterface.bulkInsert('Genres',
    [
      {
        id: '1',
        genre: 'Fiction',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        genre: 'Satire',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '3',
        genre: 'Drama',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '4',
        genre: 'Action',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '5',
        genre: 'Romance',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '6',
        genre: 'Mystery',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '7',
        genre: 'Horror',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '8',
        genre: 'Self help',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '9',
        genre: 'Health',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '10',
        genre: 'Guide',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '11',
        genre: 'Travel',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '12',
        genre: 'Children',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '13',
        genre: 'Religion',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '14',
        genre: 'Science',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '15',
        genre: 'History',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '16',
        genre: 'Math',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '17',
        genre: 'Anthology',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '18',
        genre: 'Poetry',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '19',
        genre: 'Encyclopedias',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '20',
        genre: 'Dictionaries',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '21',
        genre: 'Comics',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '22',
        genre: 'Art',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '23',
        genre: 'Cookbooks',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '24',
        genre: 'Diaries',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '25',
        genre: 'Journals',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '26',
        genre: 'Prayer books',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '27',
        genre: 'Series',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '28',
        genre: 'Trilogy',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '29',
        genre: 'Biographies',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '30',
        genre: 'Autobiographies',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '31',
        genre: 'Fantasy',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '32',
        genre: 'Philosophy',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '33',
        genre: 'Military and War',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '34',
        genre: 'Anime',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '35',
        genre: 'Psychology',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '36',
        genre: 'Real Estate',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '37',
        genre: 'Sport',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '38',
        genre: 'Adventure',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '39',
        genre: 'Spirituality',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {}),
  down: queryInterface => queryInterface
    .bulkDelete('Genres', new Date('2050-12-12'), {})
};
