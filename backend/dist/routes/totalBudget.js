"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const totalBudgetController_1 = require("../controllers/totalBudgetController");
const router = express_1.default.Router();
router.post('/', totalBudgetController_1.createOrUpdateTotalBudget);
router.get('/', totalBudgetController_1.getAllTotalBudgets);
router.get('/:year', totalBudgetController_1.getTotalBudget);
router.delete('/:id', totalBudgetController_1.deleteTotalBudget);
exports.default = router;
//# sourceMappingURL=totalBudget.js.map