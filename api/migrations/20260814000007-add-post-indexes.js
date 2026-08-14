'use strict';
module.exports = {
  async up(queryInterface) {
    await queryInterface.addIndex('Posts', ['feedSourceId'], {
      name: 'posts_feed_source_id_idx',
    });
    await queryInterface.addIndex('Posts', ['authorId'], {
      name: 'posts_author_id_idx',
    });
    await queryInterface.addIndex('Posts', ['category'], {
      name: 'posts_category_idx',
    });
    await queryInterface.addIndex('Posts', ['publishedAt'], {
      name: 'posts_published_at_idx',
    });
  },
  async down(queryInterface) {
    await queryInterface.removeIndex('Posts', 'posts_feed_source_id_idx');
    await queryInterface.removeIndex('Posts', 'posts_author_id_idx');
    await queryInterface.removeIndex('Posts', 'posts_category_idx');
    await queryInterface.removeIndex('Posts', 'posts_published_at_idx');
  },
};
