const express = require('express');
const app = express();

// Require the router module
const ps4Router = require('./routes/ps4.js');
// Use the router in your app
app.use(express.json());
app.use('/ps4', ps4Router);

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
