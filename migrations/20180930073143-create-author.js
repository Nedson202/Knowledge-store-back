module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Authors', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.STRING,
      defaultValue: Sequelize.STRING
    },
    name: {
      type: Sequelize.STRING
    },
    age: {
      type: Sequelize.STRING
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Authors') // eslint-disable-line
};
