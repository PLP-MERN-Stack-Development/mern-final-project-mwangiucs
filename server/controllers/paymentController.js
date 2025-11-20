import Payment from '../models/Payment.js';
import Student from '../models/Student.js';

export const createCheckout = async (req, res, next) => {
  try {
    const { courseId, unitId, topicId, planType, amount, paymentMethod } = req.body;
    const studentId = req.user._id;

    // Mock payment processing
    const payment = new Payment({
      studentId,
      courseId,
      unitId,
      topicId,
      amount: amount || (planType === 'basic' ? 9.99 : planType === 'pro' ? 19.99 : 29.99),
      status: 'completed', // Mock - always succeeds
      paymentMethod: paymentMethod || 'visa',
      transactionId: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      planType
    });

    await payment.save();

    // Update student premium access
    if (planType) {
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + 1); // 1 month premium

      await Student.findByIdAndUpdate(studentId, {
        premiumAccess: true,
        premiumPlan: planType,
        premiumExpiresAt: expiresAt
      });
    }

    res.status(201).json({
      payment,
      message: 'Payment successful! Premium access granted.',
      premiumAccess: true
    });
  } catch (error) {
    next(error);
  }
};

export const checkAccess = async (req, res, next) => {
  try {
    const { courseId, unitId, topicId } = req.query;
    const studentId = req.user._id;

    const student = await Student.findById(studentId);
    const hasPremium = student.premiumAccess && 
      (!student.premiumExpiresAt || student.premiumExpiresAt > new Date());

    // Check if specific content requires premium
    let requiresPremium = false;
    if (unitId || topicId) {
      const Unit = (await import('../models/Unit.js')).default;
      const Topic = (await import('../models/Topic.js')).default;
      
      if (unitId) {
        const unit = await Unit.findById(unitId);
        requiresPremium = unit?.isPremium || false;
      }
      if (topicId) {
        const topic = await Topic.findById(topicId);
        requiresPremium = topic?.isPremium || false;
      }
    }

    res.json({
      hasAccess: !requiresPremium || hasPremium,
      hasPremium,
      requiresPremium
    });
  } catch (error) {
    next(error);
  }
};

export const getPaymentStatus = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('studentId', 'name email')
      .populate('courseId', 'title');
    
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.json(payment);
  } catch (error) {
    next(error);
  }
};

