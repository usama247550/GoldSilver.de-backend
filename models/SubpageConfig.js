import mongoose from "mongoose";

const SubpageConfigSchema = new mongoose.Schema({
  id:           { type: String, required: true },
  slug:         { type: String, required: true },
  title:        { type: String, required: true },
  gridPosition: { type: String },
  thumbnail:    { type: String },
  affiliates:   [{ type: String }],
  newsSources:  [{ type: String }]
});

module.exports = mongoose.model('SubpageConfig', SubpageConfigSchema);