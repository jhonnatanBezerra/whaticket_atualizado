"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Setting_1 = __importDefault(require("../../models/Setting"));
const ListSettingsService = async ({ companyId }) => {
    const settings = await Setting_1.default.findAll({
        where: {
            companyId
        }
    });
    return settings;
};
exports.default = ListSettingsService;
