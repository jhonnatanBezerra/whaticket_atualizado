"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Ticket_1 = __importDefault(require("../../models/Ticket"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const Contact_1 = __importDefault(require("../../models/Contact"));
const User_1 = __importDefault(require("../../models/User"));
const Queue_1 = __importDefault(require("../../models/Queue"));
const Tag_1 = __importDefault(require("../../models/Tag"));
const Whatsapp_1 = __importDefault(require("../../models/Whatsapp"));
const ShowTicketUUIDService = async (uuid) => {
    const ticket = await Ticket_1.default.findOne({
        where: {
            uuid
        },
        include: [
            {
                model: Contact_1.default,
                as: "contact",
                attributes: ["id", "name", "number", "email", "profilePicUrl"],
                include: ["extraInfo"]
            },
            {
                model: User_1.default,
                as: "user",
                attributes: ["id", "name"]
            },
            {
                model: Queue_1.default,
                as: "queue",
                attributes: ["id", "name", "color"]
            },
            {
                model: Whatsapp_1.default,
                as: "whatsapp",
                attributes: ["name"]
            },
            {
                model: Tag_1.default,
                as: "tags",
                attributes: ["id", "name", "color"]
            }
        ]
    });
    if (!ticket) {
        throw new AppError_1.default("ERR_NO_TICKET_FOUND", 404);
    }
    return ticket;
};
exports.default = ShowTicketUUIDService;
