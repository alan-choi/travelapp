module.exports = function(sequelize, DataTypes) {
  var Activity = sequelize.define('Activity', {
    name: DataTypes.STRING,
    url: DataTypes.STRING,
    time_of_day: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        Activity.belongsTo(models.City);
      }
    }
  });
  return Activity;
};
