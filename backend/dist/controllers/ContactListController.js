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
exports.upload = exports.findList = exports.remove = exports.update = exports.show = exports.store = exports.index = void 0;
const Yup = __importStar(require("yup"));
const socket_1 = require("../libs/socket");
const ListService_1 = __importDefault(require("../services/ContactListService/ListService"));
const CreateService_1 = __importDefault(require("../services/ContactListService/CreateService"));
const ShowService_1 = __importDefault(require("../services/ContactListService/ShowService"));
const UpdateService_1 = __importDefault(require("../services/ContactListService/UpdateService"));
const DeleteService_1 = __importDefault(require("../services/ContactListService/DeleteService"));
const FindService_1 = __importDefault(require("../services/ContactListService/FindService"));
const lodash_1 = require("lodash");
const AppError_1 = __importDefault(require("../errors/AppError"));
const ImportContacts_1 = require("../services/ContactListService/ImportContacts");
const index = async (req, res) => {
    const { searchParam, pageNumber } = req.query;
    const { companyId } = req.user;
    const { records, count, hasMore } = await (0, ListService_1.default)({
        searchParam,
        pageNumber,
        companyId
    });
    return res.json({ records, count, hasMore });
};
exports.index = index;
const store = async (req, res) => {
    const { companyId } = req.user;
    const data = req.body;
    const schema = Yup.object().shape({
        name: Yup.string().required()
    });
    try {
        await schema.validate(data);
    }
    catch (err) {
        throw new AppError_1.default(err.message);
    }
    const record = await (0, CreateService_1.default)({
        ...data,
        companyId
    });
    const io = (0, socket_1.getIO)();
    io.emit(`company-${companyId}-ContactList`, {
        action: "create",
        record
    });
    return res.status(200).json(record);
};
exports.store = store;
const show = async (req, res) => {
    const { id } = req.params;
    const record = await (0, ShowService_1.default)(id);
    return res.status(200).json(record);
};
exports.show = show;
const update = async (req, res) => {
    const data = req.body;
    const { companyId } = req.user;
    const schema = Yup.object().shape({
        name: Yup.string().required()
    });
    try {
        await schema.validate(data);
    }
    catch (err) {
        throw new AppError_1.default(err.message);
    }
    const { id } = req.params;
    const record = await (0, UpdateService_1.default)({
        ...data,
        id
    });
    const io = (0, socket_1.getIO)();
    io.emit(`company-${companyId}-ContactList`, {
        action: "update",
        record
    });
    return res.status(200).json(record);
};
exports.update = update;
const remove = async (req, res) => {
    const { id } = req.params;
    const { companyId } = req.user;
    await (0, DeleteService_1.default)(id);
    const io = (0, socket_1.getIO)();
    io.emit(`company-${companyId}-ContactList`, {
        action: "delete",
        id
    });
    return res.status(200).json({ message: "Contact list deleted" });
};
exports.remove = remove;
const findList = async (req, res) => {
    const params = req.query;
    const records = await (0, FindService_1.default)(params);
    return res.status(200).json(records);
};
exports.findList = findList;
const upload = async (req, res) => {
    const files = req.files;
    const file = (0, lodash_1.head)(files);
    const { id } = req.params;
    const { companyId } = req.user;
    const response = await (0, ImportContacts_1.ImportContacts)(+id, companyId, file);
    const io = (0, socket_1.getIO)();
    io.emit(`company-${companyId}-ContactListItem-${+id}`, {
        action: "reload",
        records: response
    });
    return res.status(200).json(response);
};
exports.upload = upload;
