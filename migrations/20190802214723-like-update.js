/* eslint-disable max-len */
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.describeTable('Likes').then((tableDefinition) => {
    if (!tableDefinition.reviewId) {
      return queryInterface.addColumn('Likes', 'reviewId', {
        type: Sequelize.STRING,
        allowNull: true
      });
    }
    return Promise.resolve(true);
  }),

  down: (queryInterface, Sequelize) => queryInterface.removeColumn('Likes', 'reviewId') // eslint-disable-line
};
