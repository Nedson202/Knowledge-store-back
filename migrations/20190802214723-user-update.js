

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface
    .addColumn('Users', 'OTPSecret', {
      type: Sequelize.STRING,
      allowNull: true
    }),

  down: (queryInterface, Sequelize) => queryInterface.removeColumn('OTPSecret', 'email') // eslint-disable-line
};
