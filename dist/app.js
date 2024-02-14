"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var app = (0, express_1.default)();
var add = function (a, b) { return a + b; };
app.get('/', function (req, res, next) {
    console.log(add(5, 5));
    res.send('Hello');
});
app.listen(5000, function () { return console.log('Server running'); });
//# sourceMappingURL=app.js.map