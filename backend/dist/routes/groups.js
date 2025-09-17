"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const groupController_1 = require("../controllers/groupController");
const router = express_1.default.Router();
router.post('/', groupController_1.createGroup);
router.get('/', groupController_1.getGroups);
router.put('/:groupId', groupController_1.updateGroup);
router.post('/:groupId/members', groupController_1.addGroupMember);
router.delete('/:groupId/members/:userId', groupController_1.removeGroupMember);
router.get('/:groupId/search-users', groupController_1.searchUsersForGroup);
exports.default = router;
//# sourceMappingURL=groups.js.map