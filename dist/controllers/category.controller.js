"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const axios_1 = __importDefault(require("axios"));
dotenv_1.config();
const URL_MELI_API = process.env.URL_MELI_API;
exports.default = {
    async index(request, response) {
        try {
            const params = request.query;
            const itemsPerPage = typeof params.amount === 'string' ? params.amount : 3;
            const pageNumber = typeof params.page === 'string' ? params.page : 3;
            const page = pageNumber * itemsPerPage;
            const categories = await axios_1.default.get(URL_MELI_API + '/sites/MLB/categories');
            const categoriesFull = [];
            for (let i = page - itemsPerPage; i < page; i++) {
                const category = categories.data[i];
                const details = await axios_1.default.get(URL_MELI_API + '/categories/' + category.id);
                categoriesFull.push(Object.assign(Object.assign({}, category), { picture: details.data.picture, permalink: details.data.permalink }));
            }
            return response.status(201).json(categoriesFull);
        }
        catch (error) {
            return response.status(400).json({ error });
        }
    }
};
