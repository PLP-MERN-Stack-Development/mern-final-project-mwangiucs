import mongoose from 'mongoose';

const subtopicSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['video', 'text', 'quiz'], default: 'text' },
  content: { type: String },
  videoUrl: { type: String },
  duration: { type: Number }, // in minutes
  topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', required: true },
  order: { type: Number, default: 0 }
}, {
  timestamps: true
});

export default mongoose.model('Subtopic', subtopicSchema);

