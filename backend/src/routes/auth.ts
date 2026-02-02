import express from 'express';
import {
  loginWithAccessKey,
  registerUser,
  updateUserProfile,
  getUserProfile,
  searchUsers,
  getAllUsers,
  toggleUserActive
} from '../controllers/authController';

const router = express.Router();

router.post('/login', loginWithAccessKey);
router.post('/register', registerUser);
router.get('/users', getAllUsers);
router.get('/profile/:userId', getUserProfile);
router.put('/profile/:userId', updateUserProfile);
router.put('/users/:userId/toggle-active', toggleUserActive);
router.get('/search-users', searchUsers);

export default router;