'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
        defaultValue: Sequelize.STRING
      },
      username: {
        type: Sequelize.STRING,
        unique: true
      },
      email: {
        type: Sequelize.STRING,
        unique: true
      },
      password: {
        type: Sequelize.STRING
      },
      picture: {
        type: Sequelize.STRING
      },
      role: {
        type: Sequelize.ENUM,
        values: [
          'user',
          'admin',
          'super'
        ],
        allowNull: false,
        defaultValue: 'user'
      },
      isVerified: {
        type: Sequelize.ENUM,
        values: [ 'false', 'true' ],
        allowNull: false,
        defaultValue: 'false'
      },
      isEmailSent: {
        type: Sequelize.ENUM,
        values: [ 'false', 'true' ],
        allowNull: false,
        defaultValue: 'false'
      },
      socialId: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users');
  }
};