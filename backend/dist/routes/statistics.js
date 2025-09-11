"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const statisticsController_1 = require("../controllers/statisticsController");
const router = express_1.default.Router();
router.get('/dashboard', statisticsController_1.getDashboard);
router.get('/by-category', statisticsController_1.getStatisticsByCategory);
router.get('/by-owner', statisticsController_1.getStatisticsByOwner);
router.get('/total', statisticsController_1.getTotalStatistics);
exports.default = router;
//# sourceMappingURL=statistics.js.map