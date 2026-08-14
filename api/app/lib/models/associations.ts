import { FeedSource } from './FeedSource';
import { Author } from './Author';
import { Post } from './Post';

FeedSource.hasMany(Post, { foreignKey: 'feedSourceId', as: 'posts' });
Post.belongsTo(FeedSource, { foreignKey: 'feedSourceId', as: 'feedSource' });

Author.hasMany(Post, { foreignKey: 'authorId', as: 'posts' });
Post.belongsTo(Author, { foreignKey: 'authorId', as: 'authorProfile' });
