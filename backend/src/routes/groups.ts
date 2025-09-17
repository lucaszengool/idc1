import express from 'express';
import {
  createGroup,
  getGroups,
  addGroupMember,
  removeGroupMember,
  searchUsersForGroup,
  updateGroup
} from '../controllers/groupController';

const router = express.Router();

router.post('/', createGroup);
router.get('/', getGroups);
router.put('/:groupId', updateGroup);
router.post('/:groupId/members', addGroupMember);
router.delete('/:groupId/members/:userId', removeGroupMember);
router.get('/:groupId/search-users', searchUsersForGroup);

export default router;