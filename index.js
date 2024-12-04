const express = require('express');
// const bodyParser = require('body-parser');
const schoolsRoute = require('./routes/schools');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api', schoolsRoute);

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
