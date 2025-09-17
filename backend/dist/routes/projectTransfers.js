"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const projectTransferController_1 = require("../controllers/projectTransferController");
const router = express_1.default.Router();
router.post('/', projectTransferController_1.initiateProjectTransfer);
router.get('/', projectTransferController_1.getProjectTransfers);
router.post('/:transferId/approve', projectTransferController_1.approveProjectTransfer);
router.post('/:transferId/reject', projectTransferController_1.rejectProjectTransfer);
router.get('/reallocation-options', projectTransferController_1.getBudgetReallocationOptions);
exports.default = router;
//# sourceMappingURL=projectTransfers.js.map