import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  completedLessons: [{ type: Number }], // Lesson order indices
  quizScores: [{
    quizIndex: { type: Number },
    score: { type: Number },
    feedback: { type: String },
    submittedAt: { type: Date }
  }],
  progressPercentage: { type: Number, default: 0 },
  lastAccessed: { type: Date, default: Date.now }
});

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  progress: [progressSchema],
  role: { type: String, enum: ['student', 'instructor', 'admin'], default: 'student' },
  preferences: {
    notifications: { type: Boolean, default: true },
    theme: { type: String, enum: ['light', 'dark'], default: 'light' }
  },
  premiumAccess: { type: Boolean, default: false },
  premiumPlan: { type: String, enum: ['basic', 'pro', 'premium'], default: null },
  premiumExpiresAt: { type: Date },
  totalPoints: { type: Number, default: 0 }
}, {
  timestamps: true
});

export default mongoose.model('Student', studentSchema);

