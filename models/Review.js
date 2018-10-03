module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define('Review', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING
    },
    review: DataTypes.STRING,
    rating: DataTypes.FLOAT
  });

  Review.associate = (models) => {
    Review.belongsTo(models.Book, {
      foreignKey: 'bookId',
      onDelete: 'CASCADE',
      as: 'bookReviews'
    });

    Review.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
      as: 'reviewer'
    });
  };

  return Review;
};