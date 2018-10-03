module.exports = (sequelize, DataTypes) => {
  const Favorite = sequelize.define('Favorite', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING
    },
    bookId: DataTypes.STRING,
    userId: DataTypes.STRING,
  }, { paranoid: true });

  Favorite.associate = (models) => {
    Favorite.belongsTo(models.Book, {
      foreignKey: 'bookId',
      onDelete: 'CASCADE',
      as: 'favoriteBook'
    });
    Favorite.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
      as: 'favoriteOwner'
    });
  };

  return Favorite;
};
