module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Reviews', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.STRING
    },
    review: {
      type: Sequelize.STRING
    },
    rating: {
      type: Sequelize.FLOAT
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
        as: 'bookId',
      },
    },
    userId: {
      type: Sequelize.STRING,
      onDelete: 'CASCADE',
      references: {
        model: 'Users',
        key: 'id',
        as: 'userId',
      },
    }
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Reviews') // eslint-disable-line no-unused-vars
};