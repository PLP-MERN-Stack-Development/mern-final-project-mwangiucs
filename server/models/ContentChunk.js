import mongoose from 'mongoose';

const contentChunkSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  unitId: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit' },
  topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic' },
  subtopicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subtopic' },
  source: { type: String, enum: ['lesson', 'unit', 'topic', 'subtopic', 'material'], default: 'material' },
  text: { type: String, required: true },
  embedding: { type: [Number], index: '2dsphere' },
}, { timestamps: true });

// Local RAG fallback: enable full-text search on text
contentChunkSchema.index({ text: 'text' });

export default mongoose.model('ContentChunk', contentChunkSchema);
