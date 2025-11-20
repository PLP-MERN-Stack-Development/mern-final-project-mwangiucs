import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import courseRoutes from './routes/courseRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import authRoutes from './routes/authRoutes.js';
import enrollmentRoutes from './routes/enrollmentRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import instructorRoutes from './routes/instructorRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import testRoutes from './routes/testRoutes.js';
import unitRoutes from './routes/unitRoutes.js';
import progressRoutes from './routes/progressRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import adaptiveRoutes from './routes/adaptiveRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/lms')
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => {
    console.error('MongoDB Connection Error:', err.message);
    console.error('Please make sure MongoDB is running. You can start it with: mongod');
  });

// Routes
app.use('/api/courses', courseRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/enroll', enrollmentRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/instructors', instructorRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/test', testRoutes); // Test endpoint - remove in production
app.use('/api/units', unitRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/adaptive', adaptiveRoutes);

// API root endpoint
app.get('/api', (req, res) => {
  res.json({
    status: 'OK',
    message: 'LMS API is running',
    version: '2.0',
    endpoints: {
      health: '/api/health',
      auth: {
        register: 'POST /api/students/register',
        login: 'POST /api/students/login'
      },
      courses: {
        list: 'GET /api/courses',
        get: 'GET /api/courses/:id',
        create: 'POST /api/courses',
        update: 'PUT /api/courses/:id',
        delete: 'DELETE /api/courses/:id'
      },
      units: {
        getByCourse: 'GET /api/units/course/:courseId',
        createUnit: 'POST /api/units/unit',
        createTopic: 'POST /api/units/topic',
        createSubtopic: 'POST /api/units/subtopic'
      },
      enrollments: {
        enroll: 'POST /api/enroll',
        get: 'GET /api/enrollments/:studentId',
        updateProgress: 'PUT /api/enrollments/:enrollmentId/progress'
      },
      progress: {
        update: 'POST /api/progress/update',
        get: 'GET /api/progress/:studentId',
        leaderboard: 'GET /api/progress/leaderboard/all'
      },
      payment: {
        checkout: 'POST /api/payment/checkout',
        checkAccess: 'GET /api/payment/access',
        status: 'GET /api/payment/status/:id'
      },
      ai: {
        recommend: 'POST /api/ai/recommend',
        grade: 'POST /api/ai/grade',
        chat: 'POST /api/ai/chat'
      },
      quizzes: {
        list: 'GET /api/quizzes/course/:courseId',
        get: 'GET /api/quizzes/:id',
        create: 'POST /api/quizzes'
      }
    }
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'LMS API is running' });
});

// Error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

