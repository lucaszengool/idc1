"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adjustmentController_1 = require("../controllers/adjustmentController");
const router = express_1.default.Router();
router.post('/', adjustmentController_1.createAdjustment);
router.get('/', adjustmentController_1.getAdjustments);
exports.default = router;
//# sourceMappingURL=adjustments.js.map