"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConnection = void 0;
const mongodb = require("mongodb");
var MongoClient = mongodb.MongoClient;
const settings = require('../../settings.json');
const mongoConfig = settings.mongoConfig;
let options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};
let _connection = undefined;
let _db = undefined;
const dbConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!_connection) {
        _connection = yield MongoClient.connect(mongoConfig.serverUrl, options);
        _db = yield _connection.db(mongoConfig.database);
    }
    return _db;
});
exports.dbConnection = dbConnection;
