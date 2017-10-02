'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const appConfig = require('./config/app-config');

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.set('view engine', 'ejs');

app.get('/', async (req, res, next) => {
  if (typeof app.get('dbs') === 'undefined') return next();

  const dbs = {};
  for (const dataSrc of ['instagram', 'twitter']) {
    dbs[dataSrc] = 
      await MongoClient.connect(appConfig.MongoClient[dataSrc]);
  }
  app.set('dbs', dbs);
  
  return next();
});

app.get('/search', (req, res) => {
  res.render('index', {'val': 'This is a test.'});
});

app.post('/result', (req, res) => {
  res.send(req.body.filterProperty1);
});

module.exports = app;