'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Posts', 'authorId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'Authors', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn('Posts', 'authorId');
  }
};
