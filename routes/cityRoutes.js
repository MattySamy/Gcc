const express = require('express');
const router = express.Router();
const City = require('../models/City');

// إضافة مدينة جديدة
router.post('/add', async (req, res) => {
    const { name, isoCode, state } = req.body;
    try {
        const newCity = new City({ name, isoCode, state });
        await newCity.save();
        res.status(201).json(newCity);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});
// جلب المدن بناءً على الولاية
router.get('/:stateId', async (req, res) => {
  try {
    const cities = await City.find({ state: req.params.stateId });
    res.json(cities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;


// تعديل مدينة
router.put('/update/:id', async (req, res) => {
    const { name, isoCode, state } = req.body;
    try {
        const updatedCity = await City.findByIdAndUpdate(req.params.id, { name, isoCode, state }, { new: true });
        res.status(200).json(updatedCity);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// حذف مدينة
router.delete('/delete/:id', async (req, res) => {
    try {
        await City.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'City deleted' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
