"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Yup = __importStar(require("yup"));
const sequelize_1 = require("sequelize");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const Whatsapp_1 = __importDefault(require("../../models/Whatsapp"));
const ShowWhatsAppService_1 = __importDefault(require("./ShowWhatsAppService"));
const AssociateWhatsappQueue_1 = __importDefault(require("./AssociateWhatsappQueue"));
const UpdateWhatsAppService = async ({ whatsappData, whatsappId, companyId }) => {
    const schema = Yup.object().shape({
        name: Yup.string().min(2),
        status: Yup.string(),
        isDefault: Yup.boolean()
    });
    const { name, status, isDefault, session, greetingMessage, complationMessage, outOfHoursMessage, ratingMessage, queueIds = [], token, timeSendQueue, sendIdQueue = null, promptId, maxUseBotQueues, timeUseBotQueues, expiresTicket, expiresInactiveMessage } = whatsappData;
    try {
        await schema.validate({ name, status, isDefault });
    }
    catch (err) {
        throw new AppError_1.default(err.message);
    }
    if (queueIds.length > 1 && !greetingMessage) {
        throw new AppError_1.default("ERR_WAPP_GREETING_REQUIRED");
    }
    let oldDefaultWhatsapp = null;
    if (isDefault) {
        oldDefaultWhatsapp = await Whatsapp_1.default.findOne({
            where: {
                isDefault: true,
                id: { [sequelize_1.Op.not]: whatsappId },
                companyId
            }
        });
        if (oldDefaultWhatsapp) {
            await oldDefaultWhatsapp.update({ isDefault: false });
        }
    }
    const whatsapp = await (0, ShowWhatsAppService_1.default)(whatsappId, companyId);
    await whatsapp.update({
        name,
        status,
        session,
        greetingMessage,
        complationMessage,
        outOfHoursMessage,
        ratingMessage,
        isDefault,
        companyId,
        token,
        timeSendQueue,
        sendIdQueue,
        promptId,
        maxUseBotQueues,
        timeUseBotQueues,
        expiresTicket,
        expiresInactiveMessage
    });
    await (0, AssociateWhatsappQueue_1.default)(whatsapp, queueIds);
    return { whatsapp, oldDefaultWhatsapp };
};
exports.default = UpdateWhatsAppService;
