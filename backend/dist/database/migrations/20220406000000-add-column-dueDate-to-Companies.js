"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: (queryInterface) => {
        return queryInterface.addColumn("Companies", "dueDate", {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true
        });
    },
    down: (queryInterface) => {
        return queryInterface.removeColumn("Companies", "dueDate");
    }
};
