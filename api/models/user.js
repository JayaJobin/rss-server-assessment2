'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {}
  }
  User.init(
    {
      name: DataTypes.STRING,
      lineStatus: DataTypes.ENUM('online', 'offline'),
    },
    {
      sequelize,
      modelName: 'User',
    }
  );
  return User;
};
