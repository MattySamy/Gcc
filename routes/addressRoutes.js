// routes/addresses.js
const express = require('express');
const router = express.Router();
const Address = require('../models/Address'); // تأكد من المسار الصحيح

// إضافة عنوان جديد
router.post('/add', async (req, res) => {
  try {
    const { street, city, stateId, postalCode, phone } = req.body;

    // التحقق من أن جميع البيانات موجودة
    if (!street || !city || !stateId || !postalCode || !phone) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newAddress = new Address({
      street,
      city,
      state: stateId,
      postalCode,
      phone
    });

    const savedAddress = await newAddress.save();
    res.status(201).json(savedAddress);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// جلب جميع العناوين
router.get('/', async (req, res) => {
  try {
    const addresses = await Address.find();
    res.status(200).json(addresses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// جلب عنوان معين بناءً على معرفه
router.get('/:id', async (req, res) => {
  try {
    const address = await Address.findById(req.params.id);
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }
    res.status(200).json(address);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// تحديث عنوان معين
router.put('/:id', async (req, res) => {
  try {
    const { street, city, stateId, postalCode, phone } = req.body;

    // التحقق من أن جميع البيانات موجودة
    if (!street || !city || !stateId || !postalCode || !phone) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const updatedAddress = await Address.findByIdAndUpdate(
      req.params.id,
      {
        street,
        city,
        state: stateId,
        postalCode,
        phone
      },
      { new: true }
    );

    if (!updatedAddress) {
      return res.status(404).json({ message: 'Address not found' });
    }

    res.status(200).json(updatedAddress);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// حذف عنوان معين
router.delete('/:id', async (req, res) => {
  try {
    const deletedAddress = await Address.findByIdAndDelete(req.params.id);
    if (!deletedAddress) {
      return res.status(404).json({ message: 'Address not found' });
    }
    res.status(200).json({ message: 'Address deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
