const express = require('express');
const Note = require('../models/Note');
const { authRequired } = require('../middleware/auth');

const router = express.Router();

router.use(authRequired);

router.get('/', async (req, res) => {
  const notes = await Note.find({ user: req.user.id }).sort({ updatedAt: -1 });
  res.json(notes);
});

router.post('/', async (req, res) => {
  const { title, content } = req.body;
  const note = await Note.create({ user: req.user.id, title, content: content || '' });
  res.status(201).json(note);
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const updated = await Note.findOneAndUpdate(
    { _id: id, user: req.user.id },
    { title, content },
    { new: true }
  );
  if (!updated) return res.status(404).json({ message: 'Not found' });
  res.json(updated);
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const deleted = await Note.findOneAndDelete({ _id: id, user: req.user.id });
  if (!deleted) return res.status(404).json({ message: 'Not found' });
  res.json({ ok: true });
});

module.exports = router;


