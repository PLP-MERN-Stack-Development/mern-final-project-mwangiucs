import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  unitId: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit' },
  topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic' },
  subtopicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subtopic' },
  completed: { type: Boolean, default: false },
  completedAt: { type: Date },
  progressPercentage: { type: Number, default: 0 }, // For unit or topic level
  points: { type: Number, default: 0 }
}, {
  timestamps: true
});

progressSchema.index({ studentId: 1, courseId: 1, unitId: 1, topicId: 1, subtopicId: 1 }, { unique: true });

export default mongoose.model('Progress', progressSchema);

