
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING,
    },
    username: {
      type: DataTypes.STRING,
      unique: {
        args: true,
        msg: 'User with username exists'
      }
    },
    email: {
      type: DataTypes.STRING,
      unique: {
        args: true,
        msg: 'User with email exists'
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    picture: {
      type: DataTypes.STRING,
      allowNull: true
    },
    role: {
      type: DataTypes.ENUM,
      values: [
        'user',
        'admin',
        'super'
      ],
      allowNull: false,
      defaultValue: 'user'
    },
    isVerified: {
      type: DataTypes.ENUM,
      values: ['false', 'true'],
      allowNull: false,
      defaultValue: 'false'
    },
    isEmailSent: {
      type: DataTypes.ENUM,
      values: ['false', 'true'],
      allowNull: false,
      defaultValue: 'false'
    },
    socialId: {
      type: DataTypes.STRING,
      allowNull: true
    },
  }, { paranoid: true });

  User.associate = (models) => {
    User.hasMany(models.Book, {
      foreignKey: 'userId',
      as: 'users',
      onDelete: 'CASCADE'
    });
    // associations can be defined here
  };
  return User;
};
