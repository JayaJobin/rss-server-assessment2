import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import { sequelize } from './db';

export class RequestCounter extends Model<InferAttributes<RequestCounter>, InferCreationAttributes<RequestCounter>> {
  declare id: CreationOptional<number>;
  declare count: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

RequestCounter.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    count: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    createdAt: { type: DataTypes.DATE, allowNull: true },
    updatedAt: { type: DataTypes.DATE, allowNull: true },
  },
  { sequelize, modelName: 'RequestCounter', tableName: 'RequestCounters', timestamps: true }
);
