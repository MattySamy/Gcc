const express = require('express');
const { Country } = require('country-state-city');
const router = express.Router();

router.get('/countries', (req, res) => {
    const countries = Country.getAllCountries();
    res.json(countries);
});

module.exports = router;
