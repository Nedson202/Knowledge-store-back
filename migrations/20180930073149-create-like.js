module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Likes', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.STRING
    },
    users: Sequelize.ARRAY(Sequelize.STRING),
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
    replyId: {
      type: Sequelize.STRING,
      onDelete: 'CASCADE',
      references: {
        model: 'Replies',
        key: 'id',
        as: 'replyId',
      },
    },
    deletedAt: {
      allowNull: true,
      type: Sequelize.DATE
    },
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Likes') // eslint-disable-line
};
