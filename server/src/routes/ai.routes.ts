import { Router } from 'express';
import { chat, improve } from '../controllers/ai.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);
router.post('/chat', chat);
router.post('/improve', improve);

export default router;
