const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('describeWork', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    assignUserId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    addNotes: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    date: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    break: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    workType: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    projectTaskId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    clockIn: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    clockOut: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    status: {
      type: DataTypes.ENUM('0','1','2'),
      allowNull: false,
      defaultValue: "1"
    }
  }, {
    sequelize,
    tableName: 'describeWork',
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
