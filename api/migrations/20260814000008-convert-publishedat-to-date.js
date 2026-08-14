'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Posts', 'publishedAt', {
      type: Sequelize.DATE,
      allowNull: false,
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Posts', 'publishedAt', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },
};
