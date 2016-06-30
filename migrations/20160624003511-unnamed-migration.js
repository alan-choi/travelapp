
module.exports = {
  up: function (queryInterface, Sequelize) {
    return [
      queryInterface.addColumn('Users', 'username', Sequelize.STRING),
      queryInterface.addColumn('Users', 'password', Sequelize.STRING)
    ];
  },

  down: function (queryInterface, Sequelize) {
    return [
      queryInterface.removeColumn('Users', 'username'),
      queryInterface.removeColumn('Users', 'password')
    ];
  }
};
