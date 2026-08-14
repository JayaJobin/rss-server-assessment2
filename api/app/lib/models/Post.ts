import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import { sequelize } from './db';

export class Post extends Model<InferAttributes<Post>, InferCreationAttributes<Post>> {
  declare id: CreationOptional<number>;
  declare slug: string;
  declare title: string;
  declare author: string;
  declare publishedAt: Date;
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
    publishedAt: { type: DataTypes.DATE, allowNull: false },
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
  {
    sequelize,
    modelName: 'Post',
    tableName: 'Posts',
    timestamps: true,
    indexes: [
      { fields: ['feedSourceId'] },
      { fields: ['authorId'] },
      { fields: ['category'] },
      { fields: ['publishedAt'] },
    ],
  }
);
