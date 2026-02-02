import express from 'express';
import {
  loginWithAccessKey,
  registerUser,
  updateUserProfile,
  getUserProfile,
  searchUsers,
  getAllUsers,
  toggleUserActive,
  changePassword,
  resetUserPassword
} from '../controllers/authController';

const router = express.Router();

router.post('/login', loginWithAccessKey);
router.post('/register', registerUser);
router.get('/users', getAllUsers);
router.get('/profile/:userId', getUserProfile);
router.put('/profile/:userId', updateUserProfile);
router.put('/users/:userId/toggle-active', toggleUserActive);
router.put('/users/:userId/change-password', changePassword);
router.put('/users/:userId/reset-password', resetUserPassword);
router.get('/search-users', searchUsers);

export default router;
