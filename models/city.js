module.exports = function(sequelize, DataTypes) {
  var City = sequelize.define('City', {
    name: DataTypes.STRING,
    lng: DataTypes.FLOAT,
    lat: DataTypes.FLOAT
  }, {
    classMethods: {
      associate: function(models) {
        City.hasMany(models.Activity);
      }
    }
  });
  return City;
};
