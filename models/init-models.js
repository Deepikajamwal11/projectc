var DataTypes = require("sequelize").DataTypes;
var _describeWork = require("./describeWork");

function initModels(sequelize) {
  var describeWork = _describeWork(sequelize, DataTypes);


  return {
    describeWork,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
