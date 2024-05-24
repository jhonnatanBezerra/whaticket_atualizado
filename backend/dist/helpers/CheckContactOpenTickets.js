"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const AppError_1 = __importDefault(require("../errors/AppError"));
const Ticket_1 = __importDefault(require("../models/Ticket"));
const CheckContactOpenTickets = async (contactId, whatsappId) => {
    let ticket;
    if (!whatsappId) {
        ticket = await Ticket_1.default.findOne({
            where: {
                contactId,
                status: { [sequelize_1.Op.or]: ["open", "pending"] },
            }
        });
    }
    else {
        ticket = await Ticket_1.default.findOne({
            where: {
                contactId,
                status: { [sequelize_1.Op.or]: ["open", "pending"] },
                whatsappId
            }
        });
    }
    console.log(ticket);
    if (ticket) {
        throw new AppError_1.default("ERR_OTHER_OPEN_TICKET");
    }
};
exports.default = CheckContactOpenTickets;
