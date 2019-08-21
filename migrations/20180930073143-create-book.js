

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Books', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.STRING
    },
    name: {
      type: Sequelize.STRING,
      unique: true
    },
    genre: {
      type: Sequelize.ARRAY(Sequelize.STRING)
    },
    authors: {
      type: Sequelize.ARRAY(Sequelize.STRING)
    },
    downloadable: {
      type: Sequelize.ARRAY(Sequelize.STRING)
    },
    year: {
      type: Sequelize.STRING
    },
    description: {
      type: Sequelize.TEXT
    },
    image: {
      type: Sequelize.TEXT
    },
    pageCount: {
      type: Sequelize.STRING
    },
    userId: {
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
    },
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Books') // eslint-disable-line
};
