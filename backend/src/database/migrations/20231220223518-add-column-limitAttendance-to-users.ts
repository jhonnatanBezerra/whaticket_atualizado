import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.addColumn("Users", "limitAttendance", {
      defaultValue: 50,
      type: DataTypes.INTEGER
    });
  },

  down: (queryInterface: QueryInterface) => {
    return queryInterface.addColumn("Users", "limitAttendance", {
      defaultValue: 50,
      type: DataTypes.INTEGER
    });
  }
};
