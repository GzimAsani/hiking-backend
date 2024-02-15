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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpRequestHandlers = void 0;
const fs = __importStar(require("fs"));
const http_status_codes_1 = require("../enums/http-status-codes");
const User_1 = __importDefault(require("../models/User"));
class HttpRequestHandlers {
    constructor() {
        this.data = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const user = new User_1.default();
            const useri = yield user.getUser(req, res);
            res.writeHead(http_status_codes_1.HTTP_CODE.OK, { "Content-Type": "application/json" });
            res.write(JSON.stringify(useri));
            res.end();
        });
        this.login = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const user = new User_1.default();
            user.login(req, res);
        });
        this.noResponse = (req, res) => {
            fs.readFile("./src/404.html", "utf8", (error, content) => {
                res.writeHead(404, { "Content-Type": "text/html" });
                res.end(content, "utf-8");
            });
        };
        this.signup = (req, res, reqUrl) => {
            req.on("data", (data) => {
                const userObj = JSON.parse(data);
                const user = new User_1.default();
                user.saveUser(userObj).then((result) => {
                    res.writeHead(http_status_codes_1.HTTP_CODE.OK);
                    res.write(JSON.stringify(result));
                    res.end();
                }).catch((err) => {
                    res.writeHead(500);
                    res.write(err);
                    res.end();
                });
            });
        };
        this.getLogedUser = (req, res) => {
            const User = new User;
            if (req.user) {
                User.getUserByEmail(req.user).then((user) => {
                    res.writeHead(http_status_codes_1.HTTP_CODE.OK);
                    if (!user) {
                        res.write(JSON.stringify({ message: `user ${req.user} could not be found` }));
                    }
                    else {
                        res.write(JSON.stringify(user));
                    }
                    res.end();
                });
            }
            else {
                res.writeHead(http_status_codes_1.HTTP_CODE.Unauthorized);
                res.end();
            }
        };
    }
}
exports.HttpRequestHandlers = HttpRequestHandlers;
//# sourceMappingURL=request-handlers.js.map