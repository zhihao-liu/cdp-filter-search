'use strict';

const Express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const path = require('path');

const { Filter, Condition, Query } = require('./modules/filter.js');
const { getMongoSchema } = require('./modules/schema.js');
const serverConfig = require('./config/server.config.js');

const app = new Express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.use(Express.static(path.resolve(__dirname, 'public')));

app.use('/', async (req, res, next) => {
  let dbs = app.get('dbs');

  if (dbs) {
    await openAll(dbs);
    return next();
  }

  dbs = {};
  for (const dataSrc of serverConfig.dataSources) {
    dbs[dataSrc] = 
      await MongoClient.connect(serverConfig.mongoConnectionUrls[dataSrc]);
  }
  app.set('dbs', dbs);
  
  return next();
});

app.get('/search', async (req, res) => {
  const dbs = app.get('dbs');

  res.locals.allFields = await getAllFields(dbs);

  await closeAll(dbs);
  res.render('index');
});

app.post('/result', async (req, res) => {
  const dbs = app.get('dbs');

  const filter = new Filter(req.body.andOrOption);

  for (let i = 1; true; ++i) {
    const selectedField = req.body[`selectedField${i}`];
    if (!selectedField) break;
    if (selectedField === '$null') continue;


    const isExactMatch = req.body[`exactMatch${i}`] === 'on';
    const condition = new Condition(
      selectedField,
      req.body[`queryString${i}`],
      {exact: isExactMatch}
    );
    filter.addCondition(condition);
  }

  const { fromDate, toDate } = req.body;
  const dateRange = {
    from: fromDate ? new Date(`${fromDate}UTC`) : null,
    to: toDate ? new Date(`${toDate}UTC`) : null,
  };

  const query = new Query(dbs, filter, dateRange);

  const results = {};
  const resultLimit = parseInt(req.body.resultLimit);

  for (const dataSrc of serverConfig.dataSources) {
      results[dataSrc] = 
        (req.body[`${dataSrc}Included`] === 'on') ?
        await query.find[dataSrc](resultLimit) :
        [];
  };

  await closeAll(dbs);
  res.send(`Instagram: ${results.instagram.length}  Twitter: ${results.twitter.length}`);
});

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

async function getAllFields(dbs) {
  const allFields = {};
  for (const dataSrc of serverConfig.dataSources) {
    allFields[dataSrc] = await getMongoSchema(
      dbs[dataSrc].collection(serverConfig.collectionNames[dataSrc])
    );
  }

  return allFields;
}

async function openAll(dbs) {
  if (!dbs) return;

  for (const dataSrc in dbs) {
    if (!dbs[dataSrc].serverConfig.isConnected()) {
      await dbs[dataSrc].open();
    }
  }
}

async function closeAll(dbs) {
  if (!dbs) return;

  for (const dataSrc in dbs) {
    if (dbs[dataSrc].serverConfig.isConnected()) {
      await dbs[dataSrc].close();
    }
  }
}

module.exports = app;