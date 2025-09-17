import express from 'express';
import {
  loginWithAccessKey,
  registerUser,
  updateUserProfile,
  getUserProfile,
  searchUsers
} from '../controllers/authController';

const router = express.Router();

router.post('/login', loginWithAccessKey);
router.post('/register', registerUser);
router.get('/profile/:userId', getUserProfile);
router.put('/profile/:userId', updateUserProfile);
router.get('/search-users', searchUsers);

export default router;