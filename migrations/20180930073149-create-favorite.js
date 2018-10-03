module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Favorites', {
    id: {
      allowNull: false,
      primaryKey: true,
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
    bookId: {
      type: Sequelize.STRING,
      onDelete: 'CASCADE',
      references: {
        model: 'Books',
        key: 'id',
        as: 'favoriteBook',
      },
    },
    userId: {
      type: Sequelize.STRING,
      onDelete: 'CASCADE',
      references: {
        model: 'Users',
        key: 'id',
        as: 'favoriteOwner',
      },
    },
    deletedAt: {
      allowNull: true,
      type: Sequelize.DATE
    },
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Favorites') // eslint-disable-line
};
