const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('projectSubTask', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    projectTaskId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    itemCode: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    discription: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    unit: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    quantity: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    rate: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    materialCost: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    meterialCenter: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    labourHours: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    labourCost: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    labourCostCenter: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    total: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('0','1'),
      allowNull: false,
      defaultValue: "1"
    }
  }, {
    sequelize,
    tableName: 'projectSubTask',
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
