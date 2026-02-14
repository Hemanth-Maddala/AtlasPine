const express = require('express');
const Task = require('../models/Task');
const { authRequired } = require('../middleware/auth');

const router = express.Router();

router.use(authRequired);

router.get('/', async (req, res) => {
  const tasks = await Task.find({ user: req.user.id }).sort({ updatedAt: -1 });
  res.json(tasks);
});

router.post('/', async (req, res) => {
  const { title, description, status, dueDate } = req.body;
  const task = await Task.create({ user: req.user.id, title, description, status, dueDate });
  res.status(201).json(task);
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, status, dueDate } = req.body;
  const updated = await Task.findOneAndUpdate(
    { _id: id, user: req.user.id },
    { title, description, status, dueDate },
    { new: true }
  );
  if (!updated) return res.status(404).json({ message: 'Not found' });
  res.json(updated);
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const deleted = await Task.findOneAndDelete({ _id: id, user: req.user.id });
  if (!deleted) return res.status(404).json({ message: 'Not found' });
  res.json({ ok: true });
});

module.exports = router;


