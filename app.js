const express = require('express');
const app = express();

// Require the router module
const ps4Router = require('./routes/ps4.js');
const {join} = require("path");
const bodyParser = require('body-parser');

app.set('views', join(__dirname, 'views'));
app.set('view engine', 'pug');
// Use the router in your app
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/ps4', ps4Router);

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
