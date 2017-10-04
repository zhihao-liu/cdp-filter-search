'use strict';

const _ = require('underscore');

async function getMongoSchema(mongoCollection, numSampleObjs = 20) {
  let schema = {};

  const sampleObjs = await mongoCollection.find().limit(numSampleObjs).toArray();
  for (const obj of sampleObjs) buildObjSchema(obj, schema, ['_id']);

  return schema;
}

function buildObjSchema(obj, schema, ignoredProps = []) {
  if (Array.isArray(obj)) obj = obj[0];
  if (typeof obj !== 'object') return;

  for (const prop in obj) {
    if (ignoredProps.includes(prop)) continue;

    schema[prop] = {};

    if (typeof obj[prop] === 'object') {
      buildObjSchema(obj[prop], schema[prop]);  
    }
  }
}

function getAllPropPaths(obj, prePath = '') {
  let result = [];

  if (_.isEmpty(obj)) {
    result.push(prePath.slice(1));
  } else {
    for (const prop in obj) result = result.concat(getAllPropPaths(obj[prop], `${prePath}.${prop}`));
  }
  
  return result;
}

module.exports = {
  getMongoSchema: getMongoSchema,
  getAllPropPaths: getAllPropPaths
};