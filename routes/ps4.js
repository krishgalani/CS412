//routes/ps4.js
const express = require('express');
const request = require('request');
const { getApiUrl } = require('../config');
const { createClient } = require('redis');
const client = createClient();
client.on('error', err => console.log('Redis Client Error', err))
client.connect();
const router = express.Router();
const timeoutSeconds = 15;
const fetchData = async (apiUrl,option,res,key) => {
    let apiData;
    apiData = await client.json.get(key);
    if(apiData != null){
        apiData.cacheHit = true;
        res.send(apiData);
        // res.render('result',{apiData});
        await client.expire(key,timeoutSeconds); // Refresh the timer
    } else {
        try {
            switch (option) {
                case 'promise':
                    apiData = await fetchDataWithRequest(apiUrl, res);
                    break;
                case 'async':
                    apiData = await fetchDataWithAsyncAwait(apiUrl, res);
                    break;
                case 'callback':
                    apiData = await fetchDataWithCallback(apiUrl, res);
                    break;
                default:
                    throw new Error('Invalid fetch method specified.');
            }
            await setKey(key,apiData,timeoutSeconds);
        } catch (error) {
            console.error('Error fetching API data:', error.message);
            throw error;
        }
    }

};
const fetchDataWithRequest = (apiUrl,res) => {
    let apiData;
    return new Promise((resolve, reject) => {
        request(apiUrl, { json: true }, (error, response, body) => {
            if (error) {
                reject(error);
            } else {
                apiData = body;
                res.send(apiData);
                // res.render('result', {apiData});
                resolve(apiData);
            }
        });
    });
};


// Function to fetch data using async/await and node-fetch
const fetchDataWithAsyncAwait = async (apiUrl,res) => {
    const fetch = await import('node-fetch');
    let response = await fetch.default(apiUrl);
    if(response.ok){
        let apiData = await response.json();
        res.send(apiData);
        // res.render('result', {apiData});
        return apiData;
    } else{
        throw new Error(`${response.statusCode} - ${response.statusMessage}`);
    }
};

// Function to fetch data using fetch and promises
const fetchDataWithCallback = (apiUrl, res) => {
    return new Promise( (resolve, reject) => {
        request(apiUrl, { json: true }, (error, response, body) => {
            if (error) {
                reject(error);
            } else {
                const apiData = body;
                res.send(apiData);
                // res.render('result', { apiData });
                resolve(apiData);
            }
        });
    });
};



const setKey = async (key, data, timeout) => {
    await client.json.set(key, '$', data);
    await client.expire(key, timeout);
}

// GET route to render the data using a Pug template
router.get('/', (req, res) => {
    res.render('form');
});

// POST routes using different methods for fetching data

router.post('/',  (req, res) => {
    const key = req.body.city;
    const option = req.body.option;
    const apiUrl = getApiUrl(key);
    fetchData(apiUrl,option,res,key);
});

module.exports = router;
