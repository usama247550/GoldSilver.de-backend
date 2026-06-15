import mongoose from "mongoose";


const PriceSchema = new mongoose.Schema({
  gold_usd:     { type: Number },
  silver_usd:   { type: Number },
  btc_usd:      { type: Number },
  eth_usd:      { type: Number },
  sol_usd:      { type: Number },
  eur_usd:      { type: Number },
  inflation_de: { type: Number },
  updatedAt:    { type: Date, default: Date.now }
});

// Sirf 1 document hoga — hamesha upsert karenge, insert nahi
const price = mongoose.model('Price', PriceSchema);
export default price