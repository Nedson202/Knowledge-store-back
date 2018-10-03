module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define('Review', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING
    },
    review: DataTypes.STRING,
    rating: DataTypes.FLOAT,
    likes: DataTypes.INTEGER,
  }, { paranoid: true });

  Review.associate = (models) => {
    Review.belongsTo(models.Book, {
      foreignKey: 'bookId',
      onDelete: 'CASCADE',
      as: 'book'
    });

    Review.hasMany(models.Reply, {
      foreignKey: 'reviewId',
      onDelete: 'CASCADE',
      as: 'bookReplies'
    });

    Review.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
      as: 'reviewer'
    });
  };

  return Review;
};
