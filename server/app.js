import Express from 'express';
import bodyParser from 'body-parser';
import { MongoClient } from 'mongodb';
import path from 'path';

import * as filterSearch from '../lib/filter-search.js';
import * as mongoSchema from '../lib/mongo-schema.js';
import * as serverConfig from './server.config.js';

const app = new Express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.use(Express.static(path.join(__dirname, '../public')));

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
  const locals = {
    allFields: await getAllFields(app.get('dbs'))
  };

  res.render('index', {locals: locals});
});

app.post('/result', async (req, res) => {
  // const filter = new filterSearch.Filter(req.body.logicalOperator);

  // for (let i = 1; i <= serverConfig.numConditions; ++i) {
  //   const conditionField = req.body[`conditionField${i}`];
  //   if (conditionField === 'null') break;


  //   const isExactMatch = req.body[`exactMatch${i}`] === 'on' ? true : false;
  //   const condition = new filterSearch.Condition(
  //     conditionField,
  //     req.body[`conditionQuery${i}`],
  //     {exact: isExactMatch}
  //   );
  //   filter.addCondition(condition);
  // }

  // const dateRange = null;
  // const query = new filterSearch.Query(app.get('dbs'), filter, dateRange);

  // const results = {};

  // for (const dataSrc of serverConfig.dataSources) {
  //   results[dataSrc] = await query[`find${utilities.capitalize(dataSrc)}`]();
  // };

  // res.send(`Instagram: ${results.instagram.length}  Twitter: ${JSON.stringify(results.twitterlength)}`);
  console.log(req.body);
});

async function getAllFields(dbs) {
  const allFields = {};
  for (const dataSrc of serverConfig.dataSources) {
    const schema = await mongoSchema.getMongoSchema(
      dbs[dataSrc].collection(serverConfig.collectionNames[dataSrc])
    );
    allFields[dataSrc] = mongoSchema.getAllPropPaths(schema);
  }

  return allFields;
}

export default app;