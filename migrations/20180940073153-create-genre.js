module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Genres', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.STRING
    },
    genre: {
      type: Sequelize.STRING
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    deletedAt: {
      allowNull: true,
      type: Sequelize.DATE
    },
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Genres') // eslint-disable-line
};
