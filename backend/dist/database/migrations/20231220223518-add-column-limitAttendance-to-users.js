"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: (queryInterface) => {
        return queryInterface.addColumn("Users", "limitAttendance", {
            defaultValue: null,
            type: sequelize_1.DataTypes.INTEGER
        });
    },
    down: (queryInterface) => {
        return queryInterface.addColumn("Users", "limitAttendance", {
            defaultValue: null,
            type: sequelize_1.DataTypes.INTEGER
        });
    }
};
