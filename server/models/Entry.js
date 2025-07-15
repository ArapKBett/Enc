const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  subcategories: [{
    name: String,
    value: String,
    linkedEntry: { type: mongoose.Schema.Types.ObjectId, ref: 'Entry', default: null },
  }],
  attachments: [{ type: String }], // URLs or GridFS IDs for uploaded files
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Entry', entrySchema);
