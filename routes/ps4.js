const express = require('express');
const request = require('request');
const { getApiUrl } = require('../config');
const router = express.Router();

// Function to fetch data using request module
const fetchDataWithRequest = (apiUrl) => {
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
    });
};

// Function to fetch data using async/await and node-fetch
const fetchDataWithAsyncAwait = async (apiUrl) => {
    try {
        const fetch = await import('node-fetch');
        const response = await fetch.default(apiUrl);
        if (response.ok) {
            return await response.json();
        } else {
            console.error('API request failed with status:', response.status);
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
    } catch (error) {
        console.error('Error fetching API data:', error.message);
        throw error;
    }
};

// Function to fetch data using fetch and promises
const fetchDataWithFetch = (apiUrl) => {
    return fetch(apiUrl)
        .then(response => response.ok ? response.json() : Promise.reject(`HTTP error! Status: ${response.status}`))
        .catch(error => {
            console.error('Error:', error);
            throw error;
        });
};

// GET route to render the data using a Pug template
router.get('/', async (req, res) => {
    res.render('form');
});

// POST routes using different methods for fetching data

router.post('/result', async (req, res) => {
    try {
        const apiData = await fetchDataWithAsyncAwait(getApiUrl(req.body.city));
        res.render('result', { apiData });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching data from the external API.' });
    }
});

router.post('/promise', async (req, res) => {
    try {
        const apiData = await fetchDataWithRequest(getApiUrl(req.body.city));
        res.json(apiData);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching data from the external API.' });
    }
});

router.post('/async', async (req, res) => {
    try {
        const apiData = await fetchDataWithAsyncAwait(getApiUrl(req.body.city));
        res.json(apiData);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching data from the external API.' });
    }
});

router.post('/callback', async (req, res) => {
    try {
        const apiData = await fetchDataWithFetch(getApiUrl(req.body.city));
        res.json(apiData);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching data from the external API.' });
    }
});

module.exports = router;
