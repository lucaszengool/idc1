"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const projects_1 = __importDefault(require("./projects"));
const executions_1 = __importDefault(require("./executions"));
const statistics_1 = __importDefault(require("./statistics"));
const adjustments_1 = __importDefault(require("./adjustments"));
const router = express_1.default.Router();
router.use('/projects', projects_1.default);
router.use('/executions', executions_1.default);
router.use('/statistics', statistics_1.default);
router.use('/adjustments', adjustments_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map