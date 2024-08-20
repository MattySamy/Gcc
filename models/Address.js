const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'User' },
  street: { type: String, required: true },
  city: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'City' },
  state: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'State' },
  postalCode: { type: String, required: true },
  phone: { type: String, required: true }
});

module.exports = mongoose.model('Address', addressSchema);
