//routes/ps4.js
const express = require('express');
const request = require('request');
const { getApiUrl } = require('../config');
const router = express.Router();


const fetchData = (apiUrl, option) => {
    try {
        switch (option) {
            case 'promise':
                return fetchDataWithRequest(apiUrl);
            case 'async':
                return fetchDataWithAsyncAwait(apiUrl);
            case 'callback':
                return fetchDataWithFetch(apiUrl);
            default:
                throw new Error('Invalid fetch method specified.');
        }
    } catch (error) {
        console.error('Error fetching API data:', error.message);
        throw error;
    }
};
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

router.post('/', async (req, res) => {
    const apiUrl = getApiUrl(req.body.city);
    const option = req.body.option;
    try {
        const apiData = await fetchData(apiUrl, option);
        res.render('result', { apiData });
    } catch (error) {
        res.send("Not a city!")
    }
});


module.exports = router;
