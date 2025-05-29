const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('record', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    expenses: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    profit: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    loss: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    projectSubTaskId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'record',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
