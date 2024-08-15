const express = require('express');
const { State } = require('country-state-city');
const router = express.Router();

router.get('/states/:countryCode', (req, res) => {
    const { countryCode } = req.params;
    const states = State.getStatesOfCountry(countryCode);
    res.json(states);
});

module.exports = router;
