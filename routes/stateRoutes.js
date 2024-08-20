const express = require('express');
const router = express.Router();
const State = require('../models/State');

// إضافة محافظة جديدة
router.post('/add', async (req, res) => {
    const { name, isoCode, country } = req.body;
    try {
        const newState = new State({ name, isoCode, country });
        await newState.save();
        res.status(201).json(newState);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// جلب جميع المحافظات
router.get('/', async (req, res) => {
    try {
        const states = await State.find().populate('country');
        res.json(states);
        } catch (err) {
            res.status(500).json({ message: err.message });
            }
            });
// جلب الولايات بناءً على الدولة
router.get('/:countryId', async (req, res) => {
    try {
      const states = await State.find({ country: req.params.countryId });
      res.json(states);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

// تعديل محافظة
router.put('/update/:id', async (req, res) => {
    const { name, isoCode, country } = req.body;
    try {
        const updatedState = await State.findByIdAndUpdate(req.params.id, { name, isoCode, country }, { new: true });
        res.status(200).json(updatedState);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// حذف محافظة
router.delete('/delete/:id', async (req, res) => {
    try {
        await State.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'State deleted' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
