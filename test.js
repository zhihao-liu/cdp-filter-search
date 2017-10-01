'use strict';

const filter = require('./lib/filter');
const MongoClient = require('mongodb').MongoClient;
const config = require('./config/config');
const schema = require('./lib/schema');

async function main() {
  const c = new filter.Condition('$keyword', 'food', 'exact');
  const f = new filter.Filter('$or');
  f.addCondition(c);

  const dbs = {};
  for (let dataSource of ['instagram', 'twitter']) {
    dbs[dataSource] = await MongoClient.connect(config.mongoConnectionUrl[dataSource]);
  }

  const mongoSchema = await schema.getMongoSchema(dbs.twitter.collection('tweets'));

  console.log(JSON.stringify(mongoSchema, null, 2));
}

main();