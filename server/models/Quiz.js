import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true },
  questions: [{
    question: { type: String, required: true },
    options: [{ type: String }],
    correctAnswer: { type: String, required: true },
    questionType: { type: String, enum: ['multiple-choice', 'short-answer'], default: 'multiple-choice' },
    points: { type: Number, default: 10 },
    explanation: { type: String }
  }],
  totalPoints: { type: Number, default: 0 },
  timeLimit: { type: Number }, // in minutes
  aiEvaluation: { type: Boolean, default: true }
}, {
  timestamps: true
});

export default mongoose.model('Quiz', quizSchema);

