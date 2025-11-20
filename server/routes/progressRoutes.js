import express from 'express';
import { updateProgress, getProgress, getLeaderboard } from '../controllers/progressController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/update', authenticate, updateProgress);
router.get('/:studentId', authenticate, getProgress);
router.get('/leaderboard/all', getLeaderboard);

export default router;

