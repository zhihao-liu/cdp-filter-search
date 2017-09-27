'use strict';

const filter = require('./lib/filter');
const MongoClient = require('mongodb').MongoClient;
const config = require('./config/config');

async function main() {
  const c = new filter.Condition('hashtag', 'food');
  const f = new filter.Filter('$or');
  f.addCondition(c);

  const dbs = {};
  for (let dataSource of ['instagram', 'twitter']) {
    dbs[dataSource] = await MongoClient.connect(config.mongoConnectionUrl[dataSource]);
  }

  const q = new filter.Query(dbs, f);

  const res = {};
  res.instagram = await q.findInstagram(50);
  res.twitter = await q.findTwitter(50);

  console.log(res.instagram.length, res.twitter.length);
}

main();