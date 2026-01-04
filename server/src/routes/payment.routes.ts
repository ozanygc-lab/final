import { Router } from 'express';
import { createSubscription, createEbookCheckout, webhook } from '../controllers/payment.controller';
import { authenticate } from '../middleware/auth';
import express from 'express';

const router = Router();

// Webhook must be before express.json middleware
router.post('/webhook', express.raw({ type: 'application/json' }), webhook);

router.use(authenticate);
router.post('/subscription', createSubscription);
router.post('/ebook', createEbookCheckout);

export default router;
