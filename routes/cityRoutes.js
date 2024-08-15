const express = require('express');
const { City } = require('country-state-city');
const router = express.Router();

router.get('/cities/:countryCode/:stateCode', (req, res) => {
    const { countryCode, stateCode } = req.params;
    const cities = City.getCitiesOfState(countryCode, stateCode);
    res.json(cities);
});

module.exports = router;
