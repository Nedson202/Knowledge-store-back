module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define('Like', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING
    },
    likes: DataTypes.INTEGER,
    reviewId: DataTypes.STRING,
    users: DataTypes.ARRAY(DataTypes.STRING)
  }, { paranoid: true });

  Like.associate = (models) => {
    Like.belongsTo(models.Review, {
      foreignKey: 'bookId',
      onDelete: 'CASCADE',
      as: 'like'
    });
  };

  return Like;
};
