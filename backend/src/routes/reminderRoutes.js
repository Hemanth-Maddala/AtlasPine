const express = require('express');
const Reminder = require('../models/Reminder');
const { authRequired } = require('../middleware/auth');

const router = express.Router();

router.use(authRequired);

router.get('/', async (req, res) => {
  const reminders = await Reminder.find({ user: req.user.id }).sort({ remindAt: 1 });
  res.json(reminders);
});

router.post('/', async (req, res) => {
  const { title, note, remindAt } = req.body;
  const reminder = await Reminder.create({ user: req.user.id, title, note, remindAt });
  res.status(201).json(reminder);
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, note, remindAt, sent } = req.body;
  const updated = await Reminder.findOneAndUpdate(
    { _id: id, user: req.user.id },
    { title, note, remindAt, sent },
    { new: true }
  );
  if (!updated) return res.status(404).json({ message: 'Not found' });
  res.json(updated);
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const deleted = await Reminder.findOneAndDelete({ _id: id, user: req.user.id });
  if (!deleted) return res.status(404).json({ message: 'Not found' });
  res.json({ ok: true });
});

module.exports = router;


