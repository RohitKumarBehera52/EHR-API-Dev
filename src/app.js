const express = require('express');
const path = require('path');
const routes = require('./routes');
const notFound = require('./middleware/not-found.middleware');
const errorHandler = require('./middleware/error-handler.middleware');

const app = express();
const frontendPath = path.join(__dirname, '../frontend');

app.use(express.json());
app.use(express.static(frontendPath));
app.use('/api', routes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;

