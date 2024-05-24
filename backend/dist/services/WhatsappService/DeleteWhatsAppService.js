"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Whatsapp_1 = __importDefault(require("../../models/Whatsapp"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const DeleteWhatsAppService = async (id) => {
    const whatsapp = await Whatsapp_1.default.findOne({
        where: { id }
    });
    if (!whatsapp) {
        throw new AppError_1.default("ERR_NO_WAPP_FOUND", 404);
    }
    await whatsapp.destroy();
};
exports.default = DeleteWhatsAppService;
