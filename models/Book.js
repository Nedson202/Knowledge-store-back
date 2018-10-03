'use strict';
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
    author: {
      type: DataTypes.STRING,
      allowNull: false
    },
    genre: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {});

  Book.associate = models => {
    Book.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'bookOwner'
    });
    Book.hasMany(models.Review, {
      foreignKey: 'bookId',
      as: 'bookReviews',
      onDelete: 'cascade',
    });
    // associations can be defined here
  };
  return Book;
};