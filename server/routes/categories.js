const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const { auth, restrictTo } = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', auth, restrictTo('admin'), async (req, res) => {
  const { name } = req.body;
  try {
    const category = new Category({ name, createdBy: req.user.id });
    await category.save();
    req.app.get('io').emit('categoryUpdate', category);
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', auth, restrictTo('admin'), async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    req.app.get('io').emit('categoryUpdate', { _id: req.params.id, deleted: true });
    res.json({ message: 'Category deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
