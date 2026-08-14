'use strict';
module.exports = {
  async up(queryInterface) {
    await queryInterface.addIndex('FeedSources', ['url'], {
      unique: true,
      name: 'feedsources_url_unique',
    });
    await queryInterface.addIndex('Authors', ['email'], {
      unique: true,
      name: 'authors_email_unique',
    });
  },
  async down(queryInterface) {
    await queryInterface.removeIndex('FeedSources', 'feedsources_url_unique');
    await queryInterface.removeIndex('Authors', 'authors_email_unique');
  },
};
