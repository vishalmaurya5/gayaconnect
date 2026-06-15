import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  planId: { 
    type: String, 
    required: true,
    enum: ['1m', '3m', '6m', '12m'] 
  },
  amount: { 
    type: Number,
    required: true
  },
  razorpayOrderId: { 
    type: String, 
    unique: true,
    sparse: true 
  },
  razorpayPaymentId: { 
    type: String 
  },
  status: { 
    type: String, 
    enum: ['pending', 'active', 'expired', 'cancelled'], 
    default: 'pending' 
  },
  startDate: { 
    type: Date 
  },
  endDate: { 
    type: Date 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

const Subscription = mongoose.models.Subscription || mongoose.model('Subscription', subscriptionSchema);
export default Subscription;
