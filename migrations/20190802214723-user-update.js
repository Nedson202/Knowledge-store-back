/* eslint-disable max-len */
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.describeTable('Users').then((tableDefinition) => {
    if (!tableDefinition.OTPSecret) {
      return queryInterface.addColumn('Users', 'OTPSecret', {
        type: Sequelize.STRING,
        allowNull: true
      });
    }
    return Promise.resolve(true);
  }),

  down: (queryInterface, Sequelize) => queryInterface.removeColumn('Users', 'OTPSecret') // eslint-disable-line
};
