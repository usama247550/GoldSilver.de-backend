import mongoose  from 'mongoose';

const SubscriberSchema = new mongoose.Schema({
  email:       { type: String, required: true, unique: true, lowercase: true },
  source:      { type: String, default: 'homepage' },
  subscribedAt:{ type: Date, default: Date.now },
  active:      { type: Boolean, default: true },
  gdprConsent: { type: Boolean, required: true } 
});

const Subscriber = mongoose.model('Subscriber', SubscriberSchema);
export default Subscriber