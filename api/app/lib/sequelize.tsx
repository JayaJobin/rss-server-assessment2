import { Sequelize, DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import path from 'path';
import sqlite3 from 'sqlite3';

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  dialectModule: sqlite3,
  storage: path.resolve('./sqlite/dev.sqlite'),
  logging: false,
});

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare lineStatus: 'online' | 'offline';
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

User.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    lineStatus: { type: DataTypes.ENUM('online', 'offline'), allowNull: false },
    createdAt: { type: DataTypes.DATE, allowNull: true },
    updatedAt: { type: DataTypes.DATE, allowNull: true },
  },
  { sequelize, modelName: 'User', timestamps: true }
);

export class FeedSource extends Model<InferAttributes<FeedSource>, InferCreationAttributes<FeedSource>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare url: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

FeedSource.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    url: { type: DataTypes.STRING, allowNull: false },
    createdAt: { type: DataTypes.DATE, allowNull: true },
    updatedAt: { type: DataTypes.DATE, allowNull: true },
  },
  { sequelize, modelName: 'FeedSource', tableName: 'FeedSources', timestamps: true }
);

export class Author extends Model<InferAttributes<Author>, InferCreationAttributes<Author>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare email: CreationOptional<string | null>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Author.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: true },
    createdAt: { type: DataTypes.DATE, allowNull: true },
    updatedAt: { type: DataTypes.DATE, allowNull: true },
  },
  { sequelize, modelName: 'Author', tableName: 'Authors', timestamps: true }
);

export class Post extends Model<InferAttributes<Post>, InferCreationAttributes<Post>> {
  declare id: CreationOptional<number>;
  declare slug: string;
  declare title: string;
  declare author: string;
  declare publishedAt: string;
  declare category: string;
  declare summary: string;
  declare body: string;
  declare imageUrl: CreationOptional<string | null>;
  declare link: CreationOptional<string | null>;
  declare readTime: CreationOptional<string | null>;
  declare feedSourceId: CreationOptional<number | null>;
  declare authorId: CreationOptional<number | null>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Post.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    slug: { type: DataTypes.STRING, allowNull: false, unique: true },
    title: { type: DataTypes.STRING, allowNull: false },
    author: { type: DataTypes.STRING, allowNull: false },
    publishedAt: { type: DataTypes.STRING, allowNull: false },
    category: { type: DataTypes.STRING, allowNull: false },
    summary: { type: DataTypes.TEXT, allowNull: false },
    body: { type: DataTypes.TEXT, allowNull: false },
    imageUrl: { type: DataTypes.STRING, allowNull: true },
    link: { type: DataTypes.STRING, allowNull: true },
    readTime: { type: DataTypes.STRING, allowNull: true },
    feedSourceId: { type: DataTypes.INTEGER, allowNull: true },
    authorId: { type: DataTypes.INTEGER, allowNull: true },
    createdAt: { type: DataTypes.DATE, allowNull: true },
    updatedAt: { type: DataTypes.DATE, allowNull: true },
  },
  { sequelize, modelName: 'Post', tableName: 'Posts', timestamps: true }
);

FeedSource.hasMany(Post, { foreignKey: 'feedSourceId', as: 'posts' });
Post.belongsTo(FeedSource, { foreignKey: 'feedSourceId', as: 'feedSource' });

Author.hasMany(Post, { foreignKey: 'authorId', as: 'posts' });
Post.belongsTo(Author, { foreignKey: 'authorId', as: 'authorProfile' });
