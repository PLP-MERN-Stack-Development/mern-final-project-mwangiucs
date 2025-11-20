import mongoose from 'mongoose';

// Legacy lesson schema kept for backward compatibility
const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  videoUrl: { type: String },
  duration: { type: Number }, // in minutes
  order: { type: Number, required: true }
});

const quizSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String }],
  correctAnswer: { type: String, required: true },
  questionType: { type: String, enum: ['multiple-choice', 'short-answer'], default: 'multiple-choice' },
  points: { type: Number, default: 10 }
});

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true }, // Using Student model for instructors too
  category: { type: String, required: true },
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  lessons: [lessonSchema],
  quizzes: [quizSchema],
  aiTags: [{ type: String }], // Tags for AI recommendations
  thumbnail: { type: String },
  price: { type: Number, default: 0 },
  enrolledCount: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
  materials: [{ type: String }], // URLs to course materials
  isPublished: { type: Boolean, default: false }
}, {
  timestamps: true
});

export default mongoose.model('Course', courseSchema);

