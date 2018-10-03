module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Replies', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.STRING
    },
    reply: {
      type: Sequelize.STRING
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
    reviewId: {
      type: Sequelize.STRING,
      onDelete: 'CASCADE',
      references: {
        model: 'Reviews',
        key: 'id',
        as: 'reviewId',
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
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Replies') // eslint-disable-line
};
