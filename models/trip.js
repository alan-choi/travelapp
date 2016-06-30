module.exports = function(sequelize, DataTypes) {
  var Trip = sequelize.define('Trip', {
    destination: DataTypes.STRING,
    length: DataTypes.INTEGER,
    start_date: DataTypes.STRING,
    budget: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        Trip.belongsTo(models.User);
      }
    }
  });
  return Trip;
};
