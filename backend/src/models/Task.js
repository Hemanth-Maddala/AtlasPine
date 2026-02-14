const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    status: { type: String, enum: ['todo', 'in_progress', 'done'], default: 'todo' },
    dueDate: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', taskSchema);


