import { Router } from 'express';
import {
  sendMagicLinkEmail,
  verifyMagicLink,
  getCurrentUser,
} from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth';
import { strictRateLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/magic-link', strictRateLimiter, sendMagicLinkEmail);
router.post('/verify', verifyMagicLink);
router.get('/me', authenticate, getCurrentUser);

export default router;
