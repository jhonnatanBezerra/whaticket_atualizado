"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.send = exports.remove = exports.store = exports.index = void 0;
const AppError_1 = __importDefault(require("../errors/AppError"));
const SetTicketMessagesAsRead_1 = __importDefault(require("../helpers/SetTicketMessagesAsRead"));
const socket_1 = require("../libs/socket");
const Queue_1 = __importDefault(require("../models/Queue"));
const User_1 = __importDefault(require("../models/User"));
const Whatsapp_1 = __importDefault(require("../models/Whatsapp"));
const Mustache_1 = __importDefault(require("../helpers/Mustache"));
const ListMessagesService_1 = __importDefault(require("../services/MessageServices/ListMessagesService"));
const ShowTicketService_1 = __importDefault(require("../services/TicketServices/ShowTicketService"));
const FindOrCreateTicketService_1 = __importDefault(require("../services/TicketServices/FindOrCreateTicketService"));
const UpdateTicketService_1 = __importDefault(require("../services/TicketServices/UpdateTicketService"));
const DeleteWhatsAppMessage_1 = __importDefault(require("../services/WbotServices/DeleteWhatsAppMessage"));
const SendWhatsAppMedia_1 = __importDefault(require("../services/WbotServices/SendWhatsAppMedia"));
const SendWhatsAppMessage_1 = __importDefault(require("../services/WbotServices/SendWhatsAppMessage"));
const CheckNumber_1 = __importDefault(require("../services/WbotServices/CheckNumber"));
const GetProfilePicUrl_1 = __importDefault(require("../services/WbotServices/GetProfilePicUrl"));
const CreateOrUpdateContactService_1 = __importDefault(require("../services/ContactServices/CreateOrUpdateContactService"));
const index = async (req, res) => {
    const { ticketId } = req.params;
    const { pageNumber } = req.query;
    const { companyId, profile } = req.user;
    const queues = [];
    if (profile !== "admin") {
        const user = await User_1.default.findByPk(req.user.id, {
            include: [{ model: Queue_1.default, as: "queues" }]
        });
        user.queues.forEach(queue => {
            queues.push(queue.id);
        });
    }
    const { count, messages, ticket, hasMore } = await (0, ListMessagesService_1.default)({
        pageNumber,
        ticketId,
        companyId,
        queues
    });
    (0, SetTicketMessagesAsRead_1.default)(ticket);
    return res.json({ count, messages, ticket, hasMore });
};
exports.index = index;
const store = async (req, res) => {
    const { ticketId } = req.params;
    const { body, quotedMsg } = req.body;
    const medias = req.files;
    const { companyId } = req.user;
    const ticket = await (0, ShowTicketService_1.default)(ticketId, companyId);
    (0, SetTicketMessagesAsRead_1.default)(ticket);
    if (medias) {
        await Promise.all(medias.map(async (media, index) => {
            await (0, SendWhatsAppMedia_1.default)({ media, ticket, body: Array.isArray(body) ? body[index] : body });
        }));
    }
    else {
        const send = await (0, SendWhatsAppMessage_1.default)({ body, ticket, quotedMsg });
    }
    return res.send();
};
exports.store = store;
const remove = async (req, res) => {
    const { messageId } = req.params;
    const { companyId } = req.user;
    const message = await (0, DeleteWhatsAppMessage_1.default)(messageId);
    const io = (0, socket_1.getIO)();
    io.to(message.ticketId.toString()).emit(`company-${companyId}-appMessage`, {
        action: "update",
        message
    });
    return res.send();
};
exports.remove = remove;
const send = async (req, res) => {
    const { whatsappId } = req.params;
    const messageData = req.body;
    const medias = req.files;
    try {
        const whatsapp = await Whatsapp_1.default.findByPk(whatsappId);
        if (!whatsapp) {
            throw new Error("Não foi possível realizar a operação");
        }
        if (messageData.number === undefined) {
            throw new Error("O número é obrigatório");
        }
        const numberToTest = messageData.number;
        const body = messageData.body;
        const companyId = whatsapp.companyId;
        const CheckValidNumber = await (0, CheckNumber_1.default)(numberToTest, companyId);
        const number = CheckValidNumber.jid.replace(/\D/g, "");
        const profilePicUrl = await (0, GetProfilePicUrl_1.default)(number, companyId);
        const contactData = {
            name: `${number}`,
            number,
            profilePicUrl,
            isGroup: false,
            companyId
        };
        const contact = await (0, CreateOrUpdateContactService_1.default)(contactData);
        const ticket = await (0, FindOrCreateTicketService_1.default)(contact, whatsapp.id, 0, companyId);
        if (medias) {
            await Promise.all(medias.map(async (media) => {
                await req.app.get("queues").messageQueue.add("SendMessage", {
                    whatsappId,
                    data: {
                        number,
                        body: body ? (0, Mustache_1.default)(body, contact) : media.originalname,
                        mediaPath: media.path,
                        fileName: media.originalname
                    }
                }, { removeOnComplete: true, attempts: 3 });
            }));
        }
        else {
            await (0, SendWhatsAppMessage_1.default)({ body: (0, Mustache_1.default)(body, contact), ticket });
            await ticket.update({
                lastMessage: body,
            });
        }
        if (messageData.closeTicket) {
            setTimeout(async () => {
                await (0, UpdateTicketService_1.default)({
                    ticketId: ticket.id,
                    ticketData: { status: "closed" },
                    companyId
                });
            }, 1000);
        }
        (0, SetTicketMessagesAsRead_1.default)(ticket);
        return res.send({ mensagem: "Mensagem enviada" });
    }
    catch (err) {
        if (Object.keys(err).length === 0) {
            throw new AppError_1.default("Não foi possível enviar a mensagem, tente novamente em alguns instantes");
        }
        else {
            throw new AppError_1.default(err.message);
        }
    }
};
exports.send = send;
