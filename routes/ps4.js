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
const fetchData2 = async (apiUrl,res) => {
    let response = await fetch.default(apiUrl);
    if(response.ok){
        let apiData = await response.json();
        res.render('result', {apiData});
        return apiData;
    } else{
        throw new Error(`${response.statusCode} - ${response.statusMessage}`);
    }
};
// GET route to render the data using a Pug template
router.get('/', (req, res) => {
    res.render('form');
});

// POST routes using different methods for fetching data
router.post('/',  (req, res) => {
    const key = req.body.city;
    const apiUrl = getApiUrl(key);
    fetchData2(apiUrl,res);
});

module.exports = router;
