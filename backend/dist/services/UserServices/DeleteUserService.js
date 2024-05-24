"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../../models/User"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const UpdateDeletedUserOpenTicketsStatus_1 = __importDefault(require("../../helpers/UpdateDeletedUserOpenTicketsStatus"));
const DeleteUserService = async (id, companyId) => {
    const user = await User_1.default.findOne({
        where: { id }
    });
    if (!user) {
        throw new AppError_1.default("ERR_NO_USER_FOUND", 404);
    }
    const userOpenTickets = await user.$get("tickets", {
        where: { status: "open" }
    });
    if (userOpenTickets.length > 0) {
        (0, UpdateDeletedUserOpenTicketsStatus_1.default)(userOpenTickets, companyId);
    }
    await user.destroy();
};
exports.default = DeleteUserService;
