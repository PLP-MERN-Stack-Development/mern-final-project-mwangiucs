import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  unitId: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit' },
  topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic' },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  paymentMethod: { type: String },
  transactionId: { type: String },
  planType: { type: String, enum: ['basic', 'pro', 'premium'] }
}, {
  timestamps: true
});

export default mongoose.model('Payment', paymentSchema);

