"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const approvalController_1 = require("../controllers/approvalController");
const router = express_1.default.Router();
router.post('/submit', approvalController_1.submitForApproval);
router.get('/pending/:approverId', approvalController_1.getPendingApprovals);
router.post('/review/:approvalId', approvalController_1.reviewApproval);
router.get('/history', approvalController_1.getApprovalHistory);
exports.default = router;
//# sourceMappingURL=approvals.js.map