const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const infosRouter = require('./routes/infos');
const packageJson = require('../package.json');

const client = require('prom-client');

const app = express();

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API IoT',
      version: packageJson.version,
      description: 'Documentation de l\'API IoT',
    },
  },
  apis: ['./api/routes/*.js', './api/utils/swaggerComponents.js'],
};

const swaggerSpec = swaggerJsdoc(options);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/iot', infosRouter);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ** Ajout de la route /metrics **
app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', client.register.contentType);
    const metrics = await client.register.metrics();
    res.end(metrics);
  } catch (ex) {
    res.status(500).end(ex);
  }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
