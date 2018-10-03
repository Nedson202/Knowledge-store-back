module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Reviews', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.STRING
    },
    review: {
      type: Sequelize.TEXT
    },
    rating: {
      type: Sequelize.FLOAT
    },
    likes: {
      type: Sequelize.INTEGER,
      defaultValue: 0
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
    },
    deletedAt: {
      allowNull: true,
      type: Sequelize.DATE
    },
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Reviews') // eslint-disable-line
};
