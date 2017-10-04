'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const appConfig = require('./config/app-config');
const filterSearch = require('./lib/filter-search');
const mongoSchema = require('./lib/mongo-schema');

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use('/', async (req, res, next) => {
  if (typeof app.get('dbs') !== 'undefined') return next();    

  const dbs = {};
  for (const dataSrc of appConfig.dataSources) {
    dbs[dataSrc] = 
      await MongoClient.connect(appConfig.mongoConnectionUrls[dataSrc]);
  }
  app.set('dbs', dbs);
  
  return next();
});

app.get('/search', async (req, res) => {
  const locals = {
    dataSources: appConfig.dataSources,
    numConditions: appConfig.numConditions,
    allFields: await getAllFields(app.get('dbs'))
  };

  res.render('index', {locals: locals});
});

app.post('/result', async (req, res) => {
  const filter = new filterSearch.Filter(req.body.logicalOperator);

  for (let i = 1; i <= appConfig.numConditions; ++i) {
    const conditionField = req.body[`conditionField${i}`];
    if (conditionField === 'null') break;


    const isExactMatch = req.body[`exactMatch${i}`] === 'on' ? true : false;
    const condition = new filterSearch.Condition(
      conditionField,
      req.body[`conditionQuery${i}`],
      {exact: isExactMatch}
    );
    filter.addCondition(condition);
    console.log(condition);
  }

  const dateRange = null;
  const query = new filterSearch.Query(app.get('dbs'), filter, dateRange);

  const results = {};

  for (const dataSrc of appConfig.dataSources) {
    results[dataSrc] = await query[`find${capitalize(dataSrc)}`]();
  };

  res.send(`Instagram: ${results.instagram.length}  Twitter: ${JSON.stringify(results.twitter, null, 2)}`);
});

async function getAllFields(dbs) {
  const allFields = {};
  for (const dataSrc of appConfig.dataSources) {
    const schema = await mongoSchema.getMongoSchema(
      dbs[dataSrc].collection(appConfig.collectionNames[dataSrc])
    );
    allFields[dataSrc] = mongoSchema.getAllPropPaths(schema);
  }

  return allFields;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

module.exports = app;