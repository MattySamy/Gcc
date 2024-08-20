const express = require('express');
const router = express.Router();
const Country = require('../models/Country');

// إضافة بلد جديد
router.post('/add', async (req, res) => {
    const { name, isoCode, phoneCode } = req.body; // استلام كود الهاتف الدولي من الـ body
    try {
        const newCountry = new Country({ name, isoCode, phoneCode });
        await newCountry.save();
        res.status(201).json(newCountry);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// جلب الدول
router.get('/', async (req, res) => {
    try {
      const countries = await Country.find();
      res.json(countries);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
});

// تعديل بلد
router.put('/update/:id', async (req, res) => {
    const { name, isoCode, phoneCode } = req.body; // تعديل كود الهاتف الدولي
    try {
        const updatedCountry = await Country.findByIdAndUpdate(
            req.params.id,
            { name, isoCode, phoneCode }, // تحديث كود الهاتف الدولي
            { new: true }
        );
        res.status(200).json(updatedCountry);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// حذف بلد
router.delete('/delete/:id', async (req, res) => {
    try {
        await Country.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Country deleted' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
