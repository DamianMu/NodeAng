'use strict';
module.exports = (sequelize, DataTypes) => {
  const client = sequelize.define('client', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    product: DataTypes.STRING,
    productCost: DataTypes.STRING,
  }, {});
  client.associate = function(models) {

    client.belongsTo(models.type, {
      foreignKey: 'typeId',
      as: 'client',
    });
  };
  return client;
};