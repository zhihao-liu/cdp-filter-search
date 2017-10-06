const Express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const path = require('path');

const filterSearch = require('./modules/filter-search.js');
const mongoSchema = require('./modules/mongo-schema.js');
const utilities = require('./modules/utilities.js');
const serverConfig = require('./config/server.config.js');

const app = new Express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.use(Express.static(path.resolve(__dirname, 'public')));

app.use('/', async (req, res, next) => {
  if (typeof app.get('dbs') !== 'undefined') return next();    

  const dbs = {};
  for (const dataSrc of serverConfig.dataSources) {
    dbs[dataSrc] = 
      await MongoClient.connect(serverConfig.mongoConnectionUrls[dataSrc]);
  }
  app.set('dbs', dbs);
  
  return next();
});

app.get('/search', async (req, res) => {
  res.locals.allFields = await getAllFields(app.get('dbs'));

  res.render('index');
});

app.post('/result', async (req, res) => {
  const filter = new filterSearch.filterSearch.Filter(req.body.logicalOperator);

  for (let i = 1; i <= serverConfig.numfilterSearch.Conditions; ++i) {
    const conditionField = req.body[`conditionField${i}`];
    if (conditionField === 'null') break;


    const isExactMatch = req.body[`exactMatch${i}`] === 'on';
    const condition = new filterSearch.filterSearch.Condition(
      conditionField,
      req.body[`conditionfilterSearch.Query${i}`],
      {exact: isExactMatch}
    );
    filter.addfilterSearch.Condition(condition);
  }

  const dateRange = null;
  const query = new filterSearch.filterSearch.Query(app.get('dbs'), filter, dateRange);

  const results = {};

  for (const dataSrc of serverConfig.dataSources) {
    results[dataSrc] = await query[`find${utilities.capitalize(dataSrc)}`]();
  };

  res.send(`Instagram: ${results.instagram.length}  Twitter: ${JSON.stringify(results.twitterlength)}`);
  console.log(req.body);
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
    allFields[dataSrc] = await mongoSchema.getMongoSchema(
      dbs[dataSrc].collection(serverConfig.collectionNames[dataSrc])
    );
  }

  return allFields;
}

module.exports = app;