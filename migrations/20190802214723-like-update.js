

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface
    .addColumn('Likes', 'reviewId', {
      type: Sequelize.STRING,
      allowNull: true
    }),

  down: (queryInterface, Sequelize) => queryInterface.removeColumn('Likes', 'reviewId') // eslint-disable-line
};
