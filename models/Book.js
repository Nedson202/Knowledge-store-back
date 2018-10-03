

module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define('Book', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'Book with name is already registered'
      }
    },
    year: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false
    },
    pageCount: {
      type: DataTypes.STRING,
      allowNull: true
    },
    authors: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false
    },
    downloadable: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true
    },
    genre: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false
    },
  }, { paranoid: true });

  Book.associate = (models) => {
    Book.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'bookOwner'
    });
    Book.hasMany(models.Review, {
      foreignKey: 'bookId',
      as: 'bookReviews',
      onDelete: 'cascade',
    });
    Book.hasMany(models.Favorite, {
      foreignKey: 'bookId',
      as: 'favoriteBook',
      onDelete: 'cascade',
    });
    // associations can be defined here
  };
  return Book;
};
