import mongoose from 'mongoose';

const topicSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  unitId: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit', required: true },
  order: { type: Number, default: 0 },
  isPremium: { type: Boolean, default: false }
}, {
  timestamps: true
});

export default mongoose.model('Topic', topicSchema);

