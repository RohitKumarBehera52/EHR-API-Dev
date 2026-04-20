const express = require('express');
const path = require('path');
const routes = require('./routes');
const notFound = require('./middleware/not-found.middleware');
const errorHandler = require('./middleware/error-handler.middleware');

const app = express();
const publicPath = path.join(__dirname, '..', 'public');

app.use(express.json());
app.use(express.static(publicPath));
app.use('/api', routes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
