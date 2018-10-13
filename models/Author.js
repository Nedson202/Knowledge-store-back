
module.exports = (sequelize, DataTypes) => {
  const Author = sequelize.define('Author', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
      required: true,
      unique: {
        args: true,
        msg: 'Author with name is already registered'
      }
    },
    age: {
      type: DataTypes.STRING,
      required: true
    },
  }, {});

  Author.associate = () => {
    // associations can be defined here
  };
  return Author;
};
