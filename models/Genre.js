module.exports = (sequelize, DataTypes) => {
  const Genre = sequelize.define('Genre', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING,
    },
    genre: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {});

  // Book.associate = (models) => {
  //   Book.belongsTo(models.User, {
  //     foreignKey: 'userId',
  //     as: 'bookOwner'
  //   });
  //   Book.hasMany(models.Review, {
  //     foreignKey: 'bookId',
  //     as: 'bookReviews',
  //     onDelete: 'cascade',
  //   });
  //   // associations can be defined here
  // };
  return Genre;
};
