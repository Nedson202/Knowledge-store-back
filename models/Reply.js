module.exports = (sequelize, DataTypes) => {
  const Reply = sequelize.define('Reply', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING
    },
    reply: DataTypes.STRING,
    likes: {
      type: DataTypes.INTEGER
    },
    bookId: DataTypes.STRING,
    userId: DataTypes.STRING,
  }, { paranoid: true });

  Reply.associate = (models) => {
    Reply.belongsTo(models.Review, {
      foreignKey: 'reviewId',
      onDelete: 'CASCADE',
      as: 'reviewsReply'
    });

    Reply.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
      as: 'replier'
    });
  };

  return Reply;
};
