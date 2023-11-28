const express = require('express');
const request = require('request');
const router = express.Router();
const { getApiUrl } = require('../config');

router.post('/promise', (req, res) => {
    const apiUrl = getApiUrl(req.body.city);

    return new Promise((resolve, reject) => {
        request(apiUrl, { json: true }, (error, response, body) => {
            if (error) {
                reject(error);
            } else if (response.statusCode !== 200) {
                reject(`Error: ${response.statusCode} - ${response.statusMessage}`);
            } else {
                resolve(body);
            }
        });
    })
        .then(apiData => {
            res.json(apiData);
        })
        .catch(error => {
            res.status(500).json({ error: 'Error fetching data from the external API.' });
        });
});

module.exports = router;
