import { Router } from 'express';
import { getDashboardStats, updateProfile } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);
router.get('/dashboard', getDashboardStats);
router.put('/profile', updateProfile);

export default router;
