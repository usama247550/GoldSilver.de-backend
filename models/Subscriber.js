import mongoose  from 'mongoose';

const SubscriberSchema = new mongoose.Schema({
  email:                { type: String, required: true, unique: true, lowercase: true },
  source:               { type: String, default: 'homepage' },
  timezone:             { type: String, default: 'Europe/Berlin' },
  subscribedAt:         { type: Date, default: Date.now },
  active:               { type: Boolean, default: true },
  gdprConsent:          { type: Boolean, required: true },
  lastSentWeek:         { type: String },
  lastNewsletterSentAt: { type: Date }
});

const Subscriber = mongoose.model('Subscriber', SubscriberSchema);
export default Subscriber;