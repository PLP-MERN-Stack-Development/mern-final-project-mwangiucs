import express from 'express';
import { createCheckout, checkAccess, getPaymentStatus } from '../controllers/paymentController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/checkout', authenticate, createCheckout);
router.get('/access', authenticate, checkAccess);
router.get('/status/:id', authenticate, getPaymentStatus);

export default router;

