"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UserController_1 = require("../controllers/UserController");
const router = express_1.default.Router();
// Define routes
router.get('/user/:userId', UserController_1.UserController.getUser);
router.post('/user', UserController_1.UserController.saveUser);
router.delete('/user/:userId', UserController_1.UserController.deleteUser);
router.get('/userByEmail/:email', UserController_1.UserController.getUserByEmail);
router.post('/login', UserController_1.UserController.login);
exports.default = router;
//# sourceMappingURL=router.js.map