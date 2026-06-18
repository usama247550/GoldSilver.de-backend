import mongoose from "mongoose";

const PriceSchema = new mongoose.Schema(
  {
    gold_usd:        { type: Number, default: 0 },
    gold_usd_prev:   { type: Number, default: 0 },

    silver_usd:      { type: Number, default: 0 },
    silver_usd_prev: { type: Number, default: 0 },

    btc_usd:         { type: Number, default: 0 },
    btc_usd_prev:    { type: Number, default: 0 },

    eth_usd:         { type: Number, default: 0 },
    eth_usd_prev:    { type: Number, default: 0 },

    eur_usd:         { type: Number, default: 0 },
    eur_usd_prev:    { type: Number, default: 0 },

    cpi:             { type: Number, default: 0 },
    cpi_prev:        { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

const Price = mongoose.model("Price", PriceSchema);
export default Price;