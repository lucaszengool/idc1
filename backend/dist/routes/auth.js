"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const router = express_1.default.Router();
router.post('/login', authController_1.loginWithAccessKey);
router.post('/register', authController_1.registerUser);
router.get('/profile/:userId', authController_1.getUserProfile);
router.put('/profile/:userId', authController_1.updateUserProfile);
router.get('/search-users', authController_1.searchUsers);
exports.default = router;
//# sourceMappingURL=auth.js.map