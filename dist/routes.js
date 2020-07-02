"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const category_controller_1 = __importDefault(require("./controllers/category.controller"));
const routes = express_1.default.Router();
routes.get('/categories', category_controller_1.default.index);
exports.default = routes;
