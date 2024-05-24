"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = __importDefault(require("../../errors/AppError"));
const GetTicketWbot_1 = __importDefault(require("../../helpers/GetTicketWbot"));
const GetWbotMessage_1 = __importDefault(require("../../helpers/GetWbotMessage"));
const Message_1 = __importDefault(require("../../models/Message"));
const Ticket_1 = __importDefault(require("../../models/Ticket"));
const DeleteWhatsAppMessage = async (messageId) => {
    const message = await Message_1.default.findByPk(messageId, {
        include: [
            {
                model: Ticket_1.default,
                as: "ticket",
                include: ["contact"]
            }
        ]
    });
    if (!message) {
        throw new AppError_1.default("No message found with this ID.");
    }
    const { ticket } = message;
    const messageToDelete = await (0, GetWbotMessage_1.default)(ticket, messageId);
    try {
        const wbot = await (0, GetTicketWbot_1.default)(ticket);
        const messageDelete = messageToDelete;
        const menssageDelete = messageToDelete;
        await wbot.sendMessage(menssageDelete.remoteJid, {
            delete: {
                id: menssageDelete.id,
                remoteJid: menssageDelete.remoteJid,
                participant: menssageDelete.participant,
                fromMe: menssageDelete.fromMe
            }
        });
    }
    catch (err) {
        throw new AppError_1.default("ERR_DELETE_WAPP_MSG");
    }
    await message.update({ isDeleted: true });
    return message;
};
exports.default = DeleteWhatsAppMessage;
