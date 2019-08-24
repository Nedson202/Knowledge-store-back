module.exports = {
  up: (queryInterface, Sequelize) => queryInterface
    .changeColumn('Books', 'description', {
      type: Sequelize.TEXT,
      allowNull: true
    }),


  down: (queryInterface, Sequelize) => queryInterface
    .changeColumn('Books', 'description', {
      type: Sequelize.TEXT,
      allowNull: true
    })

};
