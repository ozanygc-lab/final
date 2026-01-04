import { Router } from 'express';
import {
  createEbook,
  getAllEbooks,
  getEbookById,
  updateEbook,
  deleteEbook,
  publishEbook,
  getPublicEbook,
} from '../controllers/ebook.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/public/:slug', getPublicEbook);

// Protected routes
router.use(authenticate);
router.post('/', createEbook);
router.get('/', getAllEbooks);
router.get('/:id', getEbookById);
router.put('/:id', updateEbook);
router.delete('/:id', deleteEbook);
router.post('/:id/publish', publishEbook);

export default router;
