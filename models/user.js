var bcrypt = require('bcrypt');

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    email: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING
  },
   {
    classMethods: {
      associate: function(models) {
        User.hasMany(models.Trip);
      },
      generateHash: function(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
      }
    },
    instanceMethods: {
      validPassword: function(password) {
        return bcrypt.compareSync(password, this.password);
      }
    },
    //getter and setter methods
  });
  return User;
};
