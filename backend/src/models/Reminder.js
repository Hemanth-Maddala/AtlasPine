const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    note: { type: String, default: '' },
    remindAt: { type: Date, required: true },
    sent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Reminder', reminderSchema);


