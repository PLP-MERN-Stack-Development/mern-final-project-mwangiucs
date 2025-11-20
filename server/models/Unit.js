import mongoose from 'mongoose';

const unitSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  order: { type: Number, default: 0 },
  isPremium: { type: Boolean, default: false }
}, {
  timestamps: true
});

export default mongoose.model('Unit', unitSchema);

