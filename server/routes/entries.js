const express = require('express');
const router = express.Router();
const Entry = require('../models/Entry');
const { auth, restrictTo } = require('../middleware/auth');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } });

router.get('/', auth, async (req, res) => {
  try {
    const entries = await Entry.find().populate('category createdBy', 'name username');
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/search', auth, async (req, res) => {
  const { q } = req.query;
  try {
    const entries = await Entry.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { content: { $regex: q, $options: 'i' } },
        { 'subcategories.value': { $regex: q, $options: 'i' } },
      ],
    }).populate('category createdBy', 'name username');
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', auth, restrictTo('admin'), async (req, res) => {
  const { title, content, category, subcategories } = req.body;
  try {
    const entry = new Entry({ title, content, category, subcategories, createdBy: req.user.id });
    await entry.save();
    req.app.get('io').emit('entryUpdate', entry);
    res.status(201).json(entry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/upload/:id', auth, restrictTo('admin', 'animator'), upload.single('file'), async (req, res) => {
  try {
    const entry = await Entry.findById(req.params.id);
    if (!entry) return res.status(404).json({ error: 'Entry not found' });
    // Store file in MongoDB GridFS or cloud storage (simplified as URL here)
    const fileUrl = `/uploads/${req.file.originalname}`; // Replace with actual storage logic
    entry.attachments.push(fileUrl);
    await entry.save();
    req.app.get('io').emit('entryUpdate', entry);
    res.json(entry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', auth, restrictTo('admin'), async (req, res) => {
  const { title, content, category, subcategories } = req.body;
  try {
    const entry = await Entry.findByIdAndUpdate(
      req.params.id,
      { title, content, category, subcategories, updatedAt: Date.now() },
      { new: true }
    ).populate('category createdBy', 'name username');
    if (!entry) return res.status(404).json({ error: 'Entry not found' });
    req.app.get('io').emit('entryUpdate', entry);
    res.json(entry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', auth, restrictTo('admin'), async (req, res) => {
  try {
    const entry = await Entry.findByIdAndDelete(req.params.id);
    if (!entry) return res.status(404).json({ error: 'Entry not found' });
    req.app.get('io').emit('entryUpdate', { _id: req.params.id, deleted: true });
    res.json({ message: 'Entry deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
