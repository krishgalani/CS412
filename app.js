//app.js
const express = require('express');
const app = express();

// Require the router module
const router = require('./routes/ps4.js');
const {join} = require("path");
const bodyParser = require('body-parser');
const cors = require("cors");

app.set('views', join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/ps4', router);

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
