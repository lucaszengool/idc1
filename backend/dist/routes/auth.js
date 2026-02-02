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
router.get('/users', authController_1.getAllUsers);
router.get('/profile/:userId', authController_1.getUserProfile);
router.put('/profile/:userId', authController_1.updateUserProfile);
router.put('/users/:userId/toggle-active', authController_1.toggleUserActive);
router.put('/users/:userId/change-password', authController_1.changePassword);
router.put('/users/:userId/reset-password', authController_1.resetUserPassword);
router.get('/search-users', authController_1.searchUsers);
exports.default = router;
//# sourceMappingURL=auth.js.map