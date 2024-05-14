const express = require('express');
const fetch = require('node-fetch')
const { getApiUrl } = require('../config.js');
const router = express.Router();

const fetchData = (apiUrl) => {
    return fetch(apiUrl)
        .then(response => response.ok ? response.json() : Promise.reject(`HTTP error! Status: ${response.status}`))
        .catch(error => {
            console.error('Error:', error);
            throw error;
        });
};

// GET route to render the data using a Pug template
router.get('/', (req, res) => {
    res.render('form');
});

// POST routes using different methods for fetching data
router.post ('/',  async (req, res) => {
    const apiUrl = getApiUrl(req.body.city);
    try {
        const apiData = await fetchData(apiUrl);
        res.render('result', { apiData });
    } catch (error) {
        res.send("Not a city!")
    }
});

module.exports = router;
