'use strict';

const filter = require('./lib/filter');
const MongoClient = require('mongodb').MongoClient;
const config = require('./config/config');

async function main() {
  const c = new filter.Condition('keyword', 'food', 'exact');
  const f = new filter.Filter('$or');
  f.addCondition(c);

  const dbs = {};
  for (let dataSource of ['instagram', 'twitter']) {
    dbs[dataSource] = await MongoClient.connect(config.mongoConnectionUrl[dataSource]);
  }

  const q = new filter.Query(dbs, f);

  const res = {};
  res.instagram = await q.findInstagram(100);
  res.twitter = await q.findTwitter(100);

  console.log(res.instagram.length, res.twitter.length);
}

main();