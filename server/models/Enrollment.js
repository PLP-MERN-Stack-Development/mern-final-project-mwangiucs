import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  enrolledAt: { type: Date, default: Date.now },
  progress: { type: Number, default: 0 }, // Percentage
  completedLessons: [{ type: Number }],
  quizResults: [{
    quizId: { type: String },
    score: { type: Number },
    feedback: { type: String },
    aiFeedback: { type: String }
  }]
}, {
  timestamps: true
});

enrollmentSchema.index({ studentId: 1, courseId: 1 }, { unique: true });

export default mongoose.model('Enrollment', enrollmentSchema);

