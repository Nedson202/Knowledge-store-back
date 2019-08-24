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

  return Genre;
};
