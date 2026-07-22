// import mongoose from "mongoose";
// const NewsItemSchema = new mongoose.Schema({
//   subpageId: { type: String, required: true, index: true },
//   date: { type: Date, required: true, index: true },
//   sourceUrl: { type: String },
//   headline: { type: String },
//   summary: { type: String, required: true },
//   conclusion: {
//     type: String,
//     enum: ["bullish", "bearish", "neutral"],
//     required: true,
//   },
//   direction: { type: String, enum: ["up", "down", "neutral"], required: true },
//   createdAt: { type: Date, default: Date.now },
// });

// // Compound index — fast subpage + date queries ke liye
// NewsItemSchema.index({ subpageId: 1, date: -1 });

// const NewsItem = mongoose.model("NewsItem", NewsItemSchema);
// export default NewsItem;


import mongoose from "mongoose";
const NewsItemSchema = new mongoose.Schema({
  subpageId: { type: String, required: true, index: true },
  date: { type: Date, required: true, index: true },
  sourceUrl: { type: String },
  headline: { type: String },
  summary: { type: String, required: true },
  conclusion: {
    type: String,
    enum: ["bullish", "bearish", "neutral"],
    required: true,
  },
  direction: { type: String, enum: ["up", "down", "neutral"], required: true },
  clicks: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

NewsItemSchema.index({ subpageId: 1, date: -1 });
NewsItemSchema.index({ subpageId: 1, clicks: -1, createdAt: -1 });

const NewsItem = mongoose.model("NewsItem", NewsItemSchema);
export default NewsItem;