'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var defaultResultLimit = 1000;

var earliestDate = {
  instagram: new Date('2010-10-01 UTC'),
  twitter: new Date('2016-06-25 UTC')
};

var Condition = exports.Condition = function () {
  function Condition(field, value, option) {
    _classCallCheck(this, Condition);

    this.field = field || {};
    this.value = value || {};
    this.option = option || {};
  }

  _createClass(Condition, [{
    key: 'queryInstagram',
    get: function get() {
      // use dollar sign to indicate that this is unified search to both data sources
      if (/^\$/.test(this.field)) {
        if (this.field === '$keyword') {
          var pattern = this.option.exact ? '\\b' + this.value + '\\b' : this.value;
          return { 'info.caption': new RegExp(pattern, 'i') };
        } else if (this.field === '$hashtag') {
          var _pattern = this.option.exact ? '#' + this.value + '\\b' : '#\\w*' + this.value;
          return { 'info.caption': new RegExp(_pattern, 'i') };
        } else if (this.field === '$place') {
          return { $or: [{ 'info.location.title': new RegExp(this.value, 'i') }, { 'info.location.city': new RegExp(this.value, 'i') }] };
        }
      } else {
        return _defineProperty({}, this.field, this.value);
      }
    }
  }, {
    key: 'queryTwitter',
    get: function get() {
      if (/^\$/.test(this.field)) {
        if (this.field === '$keyword') {
          var pattern = this.option.exact ? '\\b' + this.value + '\\b' : this.value;
          return { 'text': new RegExp(pattern, 'i') };
        } else if (this.field === '$hashtag') {
          var _pattern2 = this.option.exact ? '^' + this.value + '$' : this.value;
          return { 'entities.hashtags.text': new RegExp(_pattern2, 'i') };
        } else if (this.field === '$place') {
          return { 'place.fullname': new RegExp(this.value, 'i') };
        }
      } else {
        return _defineProperty({}, this.field, this.value);
      }
    }
  }]);

  return Condition;
}();

var Filter = exports.Filter = function () {
  function Filter(logicalOperator) {
    _classCallCheck(this, Filter);

    this.logicalOperator = logicalOperator || {};
    this.conditionList = [];
  }

  _createClass(Filter, [{
    key: 'addCondition',
    value: function addCondition(conditions) {
      if (Array.isArray(conditions)) this.conditionList.concat(conditions);else this.conditionList.push(conditions);
    }
  }, {
    key: 'queryInstagram',
    get: function get() {
      return _defineProperty({}, this.logicalOperator, this.conditionList.map(function (item) {
        return item.queryInstagram;
      }));
    }
  }, {
    key: 'queryTwitter',
    get: function get() {
      return _defineProperty({}, this.logicalOperator, this.conditionList.map(function (item) {
        return item.queryTwitter;
      }));
    }
  }]);

  return Filter;
}();

var Query = exports.Query = function () {
  function Query(dbs, filter, dateRange) {
    _classCallCheck(this, Query);

    this.dbs = dbs || {};
    this.filter = filter || {};
    this.dateRange = dateRange || {};
  }

  _createClass(Query, [{
    key: 'findInstagram',
    value: async function findInstagram() {
      var limit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultResultLimit;

      var dateFrom = this.dateRange.from || earliestDate.instagram;
      var dateTo = this.dateRange.to || new Date();
      var timestampFrom = dateFrom.getTime();
      var timestampTo = dateTo.setDate(dateTo.getDate() + 1);

      // both timestamps in seconds or in milliseconds can be handled
      var dateQuery = { $or: [{ 'info.deviceTimestamp': { $gte: timestampFrom, $lt: timestampTo } }, { 'info.deviceTimestamp': { $gte: timestampFrom / 1000, $lt: timestampTo / 1000 } }] };

      console.log(JSON.stringify(dateQuery));

      var result = await this.dbs.instagram.collection('posts').find({ $and: [dateQuery, this.filter.queryInstagram] }).limit(limit).toArray();

      return result;
    }
  }, {
    key: 'findTwitter',
    value: async function findTwitter() {
      var limit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultResultLimit;

      var result = [];

      var dateFrom = this.dateRange.from || earliestDate.twitter;
      var dateTo = this.dateRange.to || new Date();

      var collectionList = await this.dbs.twitter.collections();

      for (var d = dateTo; d >= dateFrom; d.setDate(d.getDate() - 1)) {
        var collectionName = 'tweets-' + d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        if (!collectionList.map(function (item) {
          return item.s.name;
        }).includes(collectionName)) continue;

        var partResult = await this.dbs.twitter.collection(collectionName).find(this.filter.queryTwitter).limit(limit).toArray();

        result = result.concat(partResult);

        if (result.length >= limit) {
          result.length = limit;
          break;
        }
      }

      return result;
    }
  }]);

  return Query;
}();
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.getMongoSchema = getMongoSchema;
exports.getAllPropPaths = getAllPropPaths;
var _ = require('underscore');

async function getMongoSchema(mongoCollection) {
  var numSampleObjs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 20;

  var schema = {};

  var sampleObjs = await mongoCollection.find().limit(numSampleObjs).toArray();
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = sampleObjs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var obj = _step.value;
      buildObjSchema(obj, schema, ['_id']);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return schema;
}

function buildObjSchema(obj, schema) {
  var ignoredProps = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

  if (Array.isArray(obj)) obj = obj[0];
  if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object') return;

  for (var prop in obj) {
    if (ignoredProps.includes(prop)) continue;

    schema[prop] = {};

    if (_typeof(obj[prop]) === 'object') {
      buildObjSchema(obj[prop], schema[prop]);
    }
  }
}

function getAllPropPaths(obj) {
  var prePath = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

  var result = [];

  if (_.isEmpty(obj)) {
    result.push(prePath.slice(1));
  } else {
    for (var prop in obj) {
      result = result.concat(getAllPropPaths(obj[prop], prePath + '.' + prop));
    }
  }

  return result;
}
"use strict";

module.exports.capitalize = function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _mongodb = require('mongodb');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _filterSearch = require('./lib/filter-search.js');

var filterSearch = _interopRequireWildcard(_filterSearch);

var _mongoSchema = require('./lib/mongo-schema.js');

var mongoSchema = _interopRequireWildcard(_mongoSchema);

var _serverConfig = require('./server.config.js');

var serverConfig = _interopRequireWildcard(_serverConfig);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = new _express2.default();

app.use(_bodyParser2.default.urlencoded({ extended: false }));
app.use(_bodyParser2.default.json());

app.set('view engine', 'ejs');
app.use(_express2.default.static(_path2.default.join(__dirname, '../public')));

app.use('/', async function (req, res, next) {
  if (typeof app.get('dbs') !== 'undefined') return next();

  var dbs = {};
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = serverConfig.dataSources[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var dataSrc = _step.value;

      dbs[dataSrc] = await _mongodb.MongoClient.connect(serverConfig.mongoConnectionUrls[dataSrc]);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  app.set('dbs', dbs);

  return next();
});

app.get('/search', async function (req, res) {
  var locals = {
    allFields: await getAllFields(app.get('dbs'))
  };

  res.render('index', { locals: locals });
});

app.post('/result', async function (req, res) {
  var filter = new filterSearch.Filter(req.body.logicalOperator);

  for (var i = 1; i <= serverConfig.numConditions; ++i) {
    var conditionField = req.body['conditionField' + i];
    if (conditionField === 'null') break;

    var isExactMatch = req.body['exactMatch' + i] === 'on' ? true : false;
    var condition = new filterSearch.Condition(conditionField, req.body['conditionQuery' + i], { exact: isExactMatch });
    filter.addCondition(condition);
    console.log(condition);
  }

  var dateRange = null;
  var query = new filterSearch.Query(app.get('dbs'), filter, dateRange);

  var results = {};

  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = serverConfig.dataSources[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var dataSrc = _step2.value;

      results[dataSrc] = await query['find' + utilities.capitalize(dataSrc)]();
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  ;

  res.send('Instagram: ' + results.instagram.length + '  Twitter: ' + JSON.stringify(results.twitter, null, 2));
});

async function getAllFields(dbs) {
  var allFields = {};
  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = serverConfig.dataSources[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var dataSrc = _step3.value;

      var schema = await mongoSchema.getMongoSchema(dbs[dataSrc].collection(serverConfig.collectionNames[dataSrc]));
      allFields[dataSrc] = mongoSchema.getAllPropPaths(schema);
    }
  } catch (err) {
    _didIteratorError3 = true;
    _iteratorError3 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion3 && _iterator3.return) {
        _iterator3.return();
      }
    } finally {
      if (_didIteratorError3) {
        throw _iteratorError3;
      }
    }
  }

  return allFields;
}

exports.default = app;
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var defaultServerPort = exports.defaultServerPort = 3005;

var mongoConnectionUrls = exports.mongoConnectionUrls = {
  instagram: 'mongodb://localhost:27017/cdpInsta',
  twitter: 'mongodb://localhost:27017/cdpTweets'
};

var collectionNames = exports.collectionNames = {
  instagram: 'posts',
  twitter: 'tweets'
};

var dataSources = exports.dataSources = ['instagram', 'twitter'];
