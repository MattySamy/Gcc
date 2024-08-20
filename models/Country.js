const mongoose = require('mongoose');

const countrySchema = new mongoose.Schema({
    name: { type: String, required: true },
    isoCode: { type: String, required: true, unique: true },
    phoneCode: { type: String, required: true } // إضافة كود الهاتف الدولي
});

module.exports = mongoose.model('Country', countrySchema);
