'use strict';

const _ = require('underscore');

async function _getMongoSchema(mongoCollection, numSampleObjs = 20) {
  let schema = {};

  const sampleObjs = await mongoCollection.find().limit(numSampleObjs).toArray();
  for (const obj of sampleObjs) _buildObjSchema(obj, schema, ['_id']);

  return schema;
}

function _buildObjSchema(obj, schema, ignoredProps = []) {
  if (Array.isArray(obj)) obj = obj[0];
  if (typeof obj !== 'object') return;

  for (const prop in obj) {
    if (ignoredProps.includes(prop)) continue;

    schema[prop] = {};

    if (typeof obj[prop] === 'object') {
      _buildObjSchema(obj[prop], schema[prop]);  
    }
  }
}

function _getAllPropPaths(obj, prePath = '') {
  let result = [];

  if (_.isEmpty(obj)) {
    result.push(prePath.slice(1));
  } else {
    for (const prop in obj) result = result.concat(_getAllPropPaths(obj[prop], `${prePath}.${prop}`));
  }
  
  return result;
}

module.exports = {
  getMongoSchema: _getMongoSchema,
  getAllPropPaths: _getAllPropPaths
};